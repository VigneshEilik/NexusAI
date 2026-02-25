const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');
const { validateWorkspaceAccess } = require('../middleware/multiTenant');

router.use(protect);

// ── Workspace CRUD (no workspace context needed — operating ON workspaces) ──
router.post('/', workspaceController.createWorkspace);
router.get('/', workspaceController.listWorkspaces);
router.get('/:workspaceId', workspaceController.getWorkspace);

// ── Workspace-scoped operations (need workspace access check) ──
router.patch(
    '/:workspaceId',
    validateWorkspaceAccess(['owner', 'admin']),
    workspaceController.updateWorkspace
);

// ── Members ──
router.get(
    '/:workspaceId/members',
    validateWorkspaceAccess(),
    workspaceController.listMembers
);

router.post(
    '/:workspaceId/members',
    validateWorkspaceAccess(['owner', 'admin']),
    workspaceController.inviteMember
);

router.delete(
    '/:workspaceId/members/:userId',
    validateWorkspaceAccess(['owner', 'admin']),
    workspaceController.removeMember
);

// ── Usage Dashboard ──
router.get(
    '/:workspaceId/usage',
    validateWorkspaceAccess(),
    workspaceController.getUsage
);

module.exports = router;
