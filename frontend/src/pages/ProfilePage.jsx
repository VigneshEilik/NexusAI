import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { HiOutlineCamera, HiOutlineEnvelope, HiOutlineUser, HiOutlineCalendarDays, HiOutlineShieldCheck } from 'react-icons/hi2';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        dispatch(updateUser({ name: formData.name }));
        setIsEditing(false);
        toast.success('Profile updated successfully');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
            </div>

            {/* Avatar & Banner */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="h-32 gradient-hero relative">
                    <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-white border-4 border-white dark:border-slate-800 shadow-lg">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>
                <div className="pt-14 px-6 pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isEditing
                                    ? 'gradient-primary text-white hover:opacity-90'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                            <HiOutlineUser className="w-4 h-4" /> Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                            <HiOutlineEnvelope className="w-4 h-4" /> Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm cursor-not-allowed"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                                <HiOutlineShieldCheck className="w-4 h-4" /> Role
                            </label>
                            <p className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm capitalize border border-slate-200 dark:border-slate-700">
                                {user?.role || 'User'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                                <HiOutlineCalendarDays className="w-4 h-4" /> Joined
                            </label>
                            <p className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
