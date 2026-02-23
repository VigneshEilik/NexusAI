import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleMobileSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import {
    HiOutlineHome, HiOutlineChatBubbleLeftRight, HiOutlineChartBarSquare,
    HiOutlineCreditCard, HiOutlineCog6Tooth, HiOutlineUserCircle,
    HiOutlineShieldCheck, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight,
    HiOutlineArrowRightOnRectangle, HiOutlineSun, HiOutlineMoon,
    HiOutlineSparkles, HiOutlineBars3
} from 'react-icons/hi2';

const navItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/dashboard/chat', icon: HiOutlineChatBubbleLeftRight, label: 'AI Chat' },
    { path: '/dashboard/analytics', icon: HiOutlineChartBarSquare, label: 'Analytics' },
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
    const { sidebarCollapsed, sidebarMobileOpen, theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    return (
        <>
            {/* Mobile overlay */}
            {sidebarMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => dispatch(toggleMobileSidebar())}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          sidebar-transition
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
          ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                        <HiOutlineSparkles className="w-6 h-6 text-white" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="animate-fade-in">
                            <h1 className="text-lg font-bold gradient-text">NexusAI</h1>
                            <p className="text-[10px] text-slate-400 -mt-1">Enterprise Platform</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            onClick={() => dispatch(setMobileSidebar(false))}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }
                ${sidebarCollapsed ? 'justify-center' : ''}`
                            }
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                        </NavLink>
                    ))}

                    {isAdmin && (
                        <>
                            <div className="pt-4 pb-2">
                                {!sidebarCollapsed && (
                                    <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Admin
                                    </p>
                                )}
                            </div>
                            {adminItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }
                    ${sidebarCollapsed ? 'justify-center' : ''}`
                                    }
                                >
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                                </NavLink>
                            ))}
                        </>
                    )}
                </nav>

                {/* Bottom actions */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        {theme === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
                        {!sidebarCollapsed && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                        {!sidebarCollapsed && <span className="text-sm">Logout</span>}
                    </button>

                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className={`hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
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

// Need to import setMobileSidebar
import { setMobileSidebar } from '../../store/slices/uiSlice';

export default Sidebar;
