import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleMobileSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import {
    HiOutlineBars3, HiOutlineBell, HiOutlineMagnifyingGlass,
    HiOutlineUserCircle, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => dispatch(toggleMobileSidebar())}
                        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <HiOutlineBars3 className="w-6 h-6 text-slate-600" />
                    </button>

                    {/* Search */}
                    <div className="hidden sm:flex items-center">
                        <div className="relative">
                            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-64 pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200
                                    text-slate-700 placeholder-slate-400
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <HiOutlineBell className="w-5 h-5 text-slate-500" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-slate-700">{user?.name || 'User'}</p>
                                <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'user'}</p>
                            </div>
                        </button>

                        {/* Dropdown menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-fade-in">
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                                    <p className="text-xs text-slate-400">{user?.email}</p>
                                </div>

                                <button
                                    onClick={() => { navigate('/dashboard/profile'); setShowDropdown(false); }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <HiOutlineUserCircle className="w-4 h-4" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <HiOutlineCog6Tooth className="w-4 h-4" />
                                    Settings
                                </button>

                                <div className="border-t border-slate-100 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
