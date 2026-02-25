import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleMobileSidebar, setMobileSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { clearActiveWorkspace } from '../../store/slices/workspaceSlice';
import WorkspaceSelector from '../workspace/WorkspaceSelector';
import {
    HiOutlineHome, HiOutlineChatBubbleLeftRight, HiOutlineChartBarSquare,
    HiOutlineCreditCard, HiOutlineCog6Tooth, HiOutlineUserCircle,
    HiOutlineShieldCheck, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight,
    HiOutlineArrowRightOnRectangle, HiOutlineSparkles,
    HiOutlineCircleStack, HiOutlineArrowPath, HiOutlineChartPie,
} from 'react-icons/hi2';

const navItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/dashboard/chat', icon: HiOutlineChatBubbleLeftRight, label: 'AI Chat' },
    { path: '/dashboard/analytics', icon: HiOutlineChartBarSquare, label: 'Analytics' },
];

const workspaceItems = [
    { path: '/dashboard/pipelines', icon: HiOutlineArrowPath, label: 'Pipelines' },
    { path: '/dashboard/data-sources', icon: HiOutlineCircleStack, label: 'Data Sources' },
    { path: '/dashboard/usage', icon: HiOutlineChartPie, label: 'Usage' },
];

const accountItems = [
    { path: '/dashboard/subscription', icon: HiOutlineCreditCard, label: 'Subscription' },
    { path: '/dashboard/profile', icon: HiOutlineUserCircle, label: 'Profile' },
    { path: '/dashboard/settings', icon: HiOutlineCog6Tooth, label: 'Settings' },
];

const adminItems = [
    { path: '/admin', icon: HiOutlineShieldCheck, label: 'Admin Panel' },
];

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sidebarCollapsed, sidebarMobileOpen } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(clearActiveWorkspace());
        dispatch(logout());
        navigate('/login');
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    const renderNavItems = (items) =>
        items.map((item) => (
            <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => dispatch(setMobileSidebar(false))}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm border border-blue-100'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}`
                }
            >
                <item.icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
        ));

    const renderSectionLabel = (label) =>
        !sidebarCollapsed && (
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {label}
            </p>
        );

    return (
        <>
            {/* Mobile overlay */}
            {sidebarMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => dispatch(toggleMobileSidebar())}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full z-50 flex flex-col
                    bg-white border-r border-slate-200
                    sidebar-transition
                    ${sidebarCollapsed ? 'w-20' : 'w-64'}
                    ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/25">
                        <HiOutlineSparkles className="w-6 h-6 text-white" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="animate-fade-in">
                            <h1 className="text-lg font-bold text-slate-900">NexusAI</h1>
                            <p className="text-[10px] text-slate-400 -mt-1">Enterprise Platform</p>
                        </div>
                    )}
                </div>

                {/* Workspace Selector */}
                {!sidebarCollapsed && (
                    <div className="relative border-b border-slate-100">
                        <WorkspaceSelector />
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {renderNavItems(navItems)}

                    {/* Workspace section */}
                    <div className="pt-4 pb-2">
                        {renderSectionLabel('Workspace')}
                    </div>
                    {renderNavItems(workspaceItems)}

                    {/* Account section */}
                    <div className="pt-4 pb-2">
                        {renderSectionLabel('Account')}
                    </div>
                    {renderNavItems(accountItems)}

                    {isAdmin && (
                        <>
                            <div className="pt-4 pb-2">
                                {renderSectionLabel('Admin')}
                            </div>
                            {renderNavItems(adminItems)}
                        </>
                    )}
                </nav>

                {/* Bottom actions */}
                <div className="p-3 border-t border-slate-100 space-y-1">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                        {!sidebarCollapsed && <span className="text-sm">Logout</span>}
                    </button>

                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className={`hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-50 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        {sidebarCollapsed
                            ? <HiOutlineChevronDoubleRight className="w-5 h-5" />
                            : <HiOutlineChevronDoubleLeft className="w-5 h-5" />
                        }
                        {!sidebarCollapsed && <span className="text-sm text-slate-400">Collapse</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
