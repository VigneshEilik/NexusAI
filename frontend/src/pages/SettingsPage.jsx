import toast from 'react-hot-toast';
import { HiOutlineBell, HiOutlineLockClosed, HiOutlineTrash } from 'react-icons/hi2';

const SettingsPage = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Customize your experience</p>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <HiOutlineBell className="w-5 h-5 text-blue-600" />
                    Notifications
                </h3>
                {[
                    { label: 'Email notifications', desc: 'Receive updates via email', on: true },
                    { label: 'Push notifications', desc: 'Browser push notifications', on: true },
                    { label: 'AI completion alerts', desc: 'Get notified when AI finishes analysis', on: true },
                ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-slate-700">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <button className={`relative w-14 h-7 rounded-full transition-colors ${item.on ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${item.on ? 'translate-x-7.5' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <HiOutlineLockClosed className="w-5 h-5 text-blue-600" />
                    Security
                </h3>
                <button
                    onClick={() => toast('Password change feature coming soon')}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                    <p className="font-medium text-slate-700">Change Password</p>
                    <p className="text-xs text-slate-400 mt-0.5">Update your password regularly for security</p>
                </button>
                <button
                    onClick={() => toast('Two-factor authentication coming soon')}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                    <p className="font-medium text-slate-700">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security</p>
                </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <HiOutlineTrash className="w-5 h-5" />
                    Danger Zone
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-4 py-2.5 text-sm font-medium text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
