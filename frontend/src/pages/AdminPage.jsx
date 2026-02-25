import { useState } from 'react';
import { HiOutlineUserGroup, HiOutlineChartBarSquare, HiOutlineChatBubbleLeftRight, HiOutlineMagnifyingGlass, HiOutlineShieldCheck, HiOutlineTrash } from 'react-icons/hi2';

const demoUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', plan: 'professional', status: true, joined: '2024-01-15' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'admin', plan: 'enterprise', status: true, joined: '2024-02-20' },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'user', plan: 'free', status: false, joined: '2024-03-10' },
    { id: '4', name: 'David Wilson', email: 'david@example.com', role: 'user', plan: 'starter', status: true, joined: '2024-04-05' },
    { id: '5', name: 'Eva Martinez', email: 'eva@example.com', role: 'user', plan: 'professional', status: true, joined: '2024-05-18' },
];

const AdminPage = () => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const stats = [
        { label: 'Total Users', value: '2,847', icon: HiOutlineUserGroup, color: 'bg-blue-600' },
        { label: 'Total Chats', value: '15,230', icon: HiOutlineChatBubbleLeftRight, color: 'bg-indigo-600' },
        { label: 'Analytics', value: '1,892', icon: HiOutlineChartBarSquare, color: 'bg-blue-500' },
        { label: 'Active Now', value: '423', icon: HiOutlineShieldCheck, color: 'bg-emerald-600' },
    ];

    const filteredUsers = demoUsers.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !roleFilter || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
                <p className="text-slate-500 mt-1">Manage users, monitor platform health</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-200 card-hover">
                        <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center shadow-lg mb-3`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* User Management */}
            <div className="bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial">
                                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full sm:w-56 pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Roles</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Plan</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Joined</th>
                                <th className="px-6 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${user.role === 'admin'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700 capitalize">{user.plan}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${user.status
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-red-50 text-red-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            {user.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{user.joined}</td>
                                    <td className="px-6 py-4">
                                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
