import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/uiSlice';
import toast from 'react-hot-toast';
import { HiOutlineSun, HiOutlineMoon, HiOutlineBell, HiOutlineGlobeAlt, HiOutlineLockClosed, HiOutlineTrash } from 'react-icons/hi2';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Customize your experience</p>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    {theme === 'dark' ? <HiOutlineMoon className="w-5 h-5" /> : <HiOutlineSun className="w-5 h-5" />}
                    Appearance
                </h3>
                <div className="flex items-center justify-between py-3">
                    <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
                        <p className="text-xs text-slate-400">Toggle between light and dark themes</p>
                    </div>
                    <button
                        onClick={() => { dispatch(toggleTheme()); toast.success(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`); }}
                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'
                            }`}
                    >
                        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7.5' : 'translate-x-0.5'
                            }`} />
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineBell className="w-5 h-5" />
                    Notifications
                </h3>
                {[
                    { label: 'Email notifications', desc: 'Receive updates via email' },
                    { label: 'Push notifications', desc: 'Browser push notifications' },
                    { label: 'AI completion alerts', desc: 'Get notified when AI finishes analysis' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <button className="relative w-14 h-7 rounded-full bg-primary-600 transition-colors">
                            <div className="absolute top-0.5 translate-x-7.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineLockClosed className="w-5 h-5" />
                    Security
                </h3>
                <button
                    onClick={() => toast('Password change feature coming soon')}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm"
                >
                    <p className="font-medium text-slate-700 dark:text-slate-300">Change Password</p>
                    <p className="text-xs text-slate-400 mt-0.5">Update your password regularly for security</p>
                </button>
                <button
                    onClick={() => toast('Two-factor authentication coming soon')}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm"
                >
                    <p className="font-medium text-slate-700 dark:text-slate-300">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security</p>
                </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-red-200 dark:border-red-900/30">
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <HiOutlineTrash className="w-5 h-5" />
                    Danger Zone
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-4 py-2.5 text-sm font-medium text-red-600 border border-red-300 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
