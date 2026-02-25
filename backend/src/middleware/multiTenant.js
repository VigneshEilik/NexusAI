const WorkspaceUser = require('../models/WorkspaceUser');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

/**
 * Middleware to validate if user has access to a workspace
 * @param {Array} allowedRoles - Optional list of roles allowed for this action
 */
const validateWorkspaceAccess = (allowedRoles = ['owner', 'admin', 'member']) => {
    return asyncHandler(async (req, res, next) => {
        const workspaceId = req.headers['x-workspace-id'] || req.params.workspaceId || req.body.workspaceId;

        if (!workspaceId) {
            return next(new AppError('Workspace ID is required', 400));
        }

        const workspaceUser = await WorkspaceUser.findOne({
            workspace: workspaceId,
            user: req.user.id
        });

        if (!workspaceUser) {
            return next(new AppError('You do not have access to this workspace', 403));
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(workspaceUser.role)) {
            return next(new AppError('Insufficient permissions in this workspace', 403));
        }

        // Attach workspace context to request
        req.workspaceId = workspaceId;
        req.workspaceRole = workspaceUser.role;
        next();
    });
};

module.exports = { validateWorkspaceAccess };
