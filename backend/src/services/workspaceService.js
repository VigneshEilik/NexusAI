const Workspace = require('../models/Workspace');
const WorkspaceUser = require('../models/WorkspaceUser');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const AppError = require('../utils/AppError');
const logger = require('../config/logger');

/**
 * Workspace Service
 *
 * Business logic for workspace CRUD and membership management.
 * Controllers call this — no Mongoose queries in controllers.
 */
class WorkspaceService {

    /**
     * Create a new workspace and assign the creator as owner
     */
    async createWorkspace(userId, data) {
        const slug = data.slug || this._generateSlug(data.name);

        // Check for slug collision
        const existing = await Workspace.findOne({ slug });
        if (existing) throw new AppError('A workspace with this slug already exists', 409);

        const workspace = await Workspace.create({
            name: data.name,
            slug,
            owner: userId,
            subscriptionPlan: 'free',
        });

        // Auto-add creator as owner
        await WorkspaceUser.create({
            workspace: workspace._id,
            user: userId,
            role: 'owner',
            status: 'active',
        });

        logger.info(`Workspace created: ${workspace._id} by user ${userId}`);
        return workspace;
    }

    /**
     * List all workspaces the user belongs to
     */
    async listUserWorkspaces(userId) {
        const memberships = await WorkspaceUser.find({ user: userId, status: 'active' })
            .populate('workspace')
            .lean();

        return memberships.map(m => ({
            ...m.workspace,
            role: m.role,
        }));
    }

    /**
     * Get a single workspace with membership info
     */
    async getWorkspace(workspaceId, userId) {
        const membership = await WorkspaceUser.findOne({
            workspace: workspaceId,
            user: userId,
        }).populate('workspace').lean();

        if (!membership) throw new AppError('Workspace not found or access denied', 404);

        return { ...membership.workspace, role: membership.role };
    }

    /**
     * Invite a user to a workspace
     */
    async inviteUser(workspaceId, invitedUserId, role = 'member') {
        const existing = await WorkspaceUser.findOne({
            workspace: workspaceId,
            user: invitedUserId,
        });

        if (existing) throw new AppError('User is already a member of this workspace', 409);

        const membership = await WorkspaceUser.create({
            workspace: workspaceId,
            user: invitedUserId,
            role,
            status: 'invited',
        });

        logger.info(`User ${invitedUserId} invited to workspace ${workspaceId} as ${role}`);
        return membership;
    }

    /**
     * List members of a workspace
     */
    async listMembers(workspaceId) {
        return WorkspaceUser.find({ workspace: workspaceId })
            .populate('user', 'name email avatar')
            .lean();
    }

    /**
     * Remove a member from a workspace
     */
    async removeMember(workspaceId, targetUserId) {
        const member = await WorkspaceUser.findOne({
            workspace: workspaceId,
            user: targetUserId,
        });

        if (!member) throw new AppError('Member not found', 404);
        if (member.role === 'owner') throw new AppError('Cannot remove the workspace owner', 400);

        await WorkspaceUser.deleteOne({ _id: member._id });
        logger.info(`User ${targetUserId} removed from workspace ${workspaceId}`);
    }

    /**
     * Update workspace settings
     */
    async updateWorkspace(workspaceId, data) {
        const allowed = ['name', 'settings'];
        const update = {};
        for (const key of allowed) {
            if (data[key] !== undefined) update[key] = data[key];
        }

        const workspace = await Workspace.findByIdAndUpdate(workspaceId, update, { new: true });
        if (!workspace) throw new AppError('Workspace not found', 404);
        return workspace;
    }

    // ── Helpers ──

    _generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            + '-' + Date.now().toString(36);
    }
}

module.exports = new WorkspaceService();
