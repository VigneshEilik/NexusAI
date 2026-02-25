import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveWorkspace } from '../../store/slices/workspaceSlice';
import { useGetWorkspacesQuery, useCreateWorkspaceMutation } from '../../store/api/workspaceApi';
import {
    HiOutlineBuildingOffice2,
    HiOutlineChevronUpDown,
    HiOutlinePlusCircle,
    HiOutlineCheck,
} from 'react-icons/hi2';

const WorkspaceSelector = () => {
    const dispatch = useDispatch();
    const { activeWorkspace } = useSelector((state) => state.workspace);
    const { data, isLoading } = useGetWorkspacesQuery();
    const [createWorkspace, { isLoading: isCreating }] = useCreateWorkspaceMutation();

    const [open, setOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newName, setNewName] = useState('');
    const dropdownRef = useRef(null);

    const workspaces = data?.data?.workspaces || [];

    // Auto-select first workspace if none active
    useEffect(() => {
        if (!activeWorkspace && workspaces.length > 0) {
            dispatch(setActiveWorkspace(workspaces[0]));
        }
    }, [workspaces, activeWorkspace, dispatch]);

    useEffect(() => {
        const handle = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const handleSelect = (ws) => {
        dispatch(setActiveWorkspace(ws));
        setOpen(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            const res = await createWorkspace({ name: newName }).unwrap();
            dispatch(setActiveWorkspace(res.data.workspace));
            setNewName('');
            setShowCreateModal(false);
        } catch {
            // Error handled by toast
        }
    };

    if (isLoading) {
        return (
            <div className="px-3 py-2">
                <div className="h-10 skeleton rounded-xl" />
            </div>
        );
    }

    return (
        <div className="px-3 py-2" ref={dropdownRef}>
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-blue-50
                    border border-blue-100 hover:border-blue-200 transition-all text-left"
            >
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <HiOutlineBuildingOffice2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                        {activeWorkspace?.name || 'Select Workspace'}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                        {activeWorkspace?.role || 'No workspace'}
                    </p>
                </div>
                <HiOutlineChevronUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-3 right-3 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-fade-in max-h-64 overflow-y-auto">
                    {workspaces.map((ws) => (
                        <button
                            key={ws._id}
                            onClick={() => handleSelect(ws)}
                            className={`flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors
                                ${activeWorkspace?._id === ws._id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <HiOutlineBuildingOffice2 className="w-4 h-4 shrink-0" />
                            <span className="truncate flex-1 text-left">{ws.name}</span>
                            {activeWorkspace?._id === ws._id && (
                                <HiOutlineCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                        </button>
                    ))}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                            onClick={() => { setShowCreateModal(true); setOpen(false); }}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            <HiOutlinePlusCircle className="w-4 h-4" />
                            Create Workspace
                        </button>
                    </div>
                </div>
            )}

            {/* Create Workspace Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Create Workspace</h3>
                        <p className="text-sm text-slate-500 mb-4">Set up a new workspace for your team.</p>

                        <form onSubmit={handleCreate}>
                            <input
                                type="text"
                                placeholder="Workspace name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2
                                    focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-700
                                    placeholder-slate-400 transition-all"
                                autoFocus
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600
                                        border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || !newName.trim()}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white
                                        bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors btn-glow"
                                >
                                    {isCreating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceSelector;
