const workspaceService = require('../services/workspaceService');
const usageMeteringService = require('../services/usageMeteringService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create a new workspace
 * @route   POST /api/v1/workspaces
 * @access  Private
 */
exports.createWorkspace = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.createWorkspace(req.user.id, req.body);

    res.status(201).json({
        status: 'success',
        data: { workspace },
    });
});

/**
 * @desc    List workspaces the user belongs to
 * @route   GET /api/v1/workspaces
 * @access  Private
 */
exports.listWorkspaces = asyncHandler(async (req, res) => {
    const workspaces = await workspaceService.listUserWorkspaces(req.user.id);

    res.status(200).json({
        status: 'success',
        data: { workspaces },
    });
});

/**
 * @desc    Get a single workspace
 * @route   GET /api/v1/workspaces/:workspaceId
 * @access  Private (member)
 */
exports.getWorkspace = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.getWorkspace(req.params.workspaceId, req.user.id);

    res.status(200).json({
        status: 'success',
        data: { workspace },
    });
});

/**
 * @desc    Update workspace settings
 * @route   PATCH /api/v1/workspaces/:workspaceId
 * @access  Private (owner, admin)
 */
exports.updateWorkspace = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.updateWorkspace(req.workspaceId, req.body);

    res.status(200).json({
        status: 'success',
        data: { workspace },
    });
});

/**
 * @desc    Invite a user to workspace
 * @route   POST /api/v1/workspaces/:workspaceId/members
 * @access  Private (owner, admin)
 */
exports.inviteMember = asyncHandler(async (req, res) => {
    const membership = await workspaceService.inviteUser(
        req.workspaceId,
        req.body.userId,
        req.body.role
    );

    res.status(201).json({
        status: 'success',
        data: { membership },
    });
});

/**
 * @desc    List workspace members
 * @route   GET /api/v1/workspaces/:workspaceId/members
 * @access  Private (member)
 */
exports.listMembers = asyncHandler(async (req, res) => {
    const members = await workspaceService.listMembers(req.workspaceId);

    res.status(200).json({
        status: 'success',
        data: { members },
    });
});

/**
 * @desc    Remove a member from workspace
 * @route   DELETE /api/v1/workspaces/:workspaceId/members/:userId
 * @access  Private (owner, admin)
 */
exports.removeMember = asyncHandler(async (req, res) => {
    await workspaceService.removeMember(req.workspaceId, req.params.userId);

    res.status(200).json({
        status: 'success',
        message: 'Member removed successfully',
    });
});

/**
 * @desc    Get workspace usage dashboard
 * @route   GET /api/v1/workspaces/:workspaceId/usage
 * @access  Private (member)
 */
exports.getUsage = asyncHandler(async (req, res) => {
    const [current, limits, daily] = await Promise.all([
        usageMeteringService.getCurrentUsage(req.workspaceId),
        usageMeteringService.getPlanLimits(req.workspaceId),
        usageMeteringService.getDailyBreakdown(req.workspaceId),
    ]);

    res.status(200).json({
        status: 'success',
        data: { usage: current, limits, dailyBreakdown: daily },
    });
});
