import { HiOutlineChatBubbleLeftRight, HiOutlineChartBarSquare, HiOutlineSparkles, HiOutlineClock, HiOutlineArrowTrendingUp, HiOutlineUserGroup } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const stats = [
    { label: 'AI Conversations', value: '128', change: '+12%', icon: HiOutlineChatBubbleLeftRight, color: 'bg-blue-600' },
    { label: 'Analytics Reports', value: '34', change: '+8%', icon: HiOutlineChartBarSquare, color: 'bg-indigo-600' },
    { label: 'AI Tokens Used', value: '45.2K', change: '+23%', icon: HiOutlineSparkles, color: 'bg-blue-500' },
    { label: 'Time Saved', value: '89h', change: '+15%', icon: HiOutlineClock, color: 'bg-emerald-600' },
];

const recentActivity = [
    { action: 'Generated analytics report', item: 'Q4 Sales Data.csv', time: '2 min ago', type: 'analytics' },
    { action: 'AI chat completed', item: 'Market Research Analysis', time: '15 min ago', type: 'chat' },
    { action: 'Uploaded dataset', item: 'Customer Feedback 2024.csv', time: '1 hour ago', type: 'upload' },
    { action: 'AI chat completed', item: 'Code Review Assistant', time: '3 hours ago', type: 'chat' },
    { action: 'Analytics insight generated', item: 'Revenue Trends', time: '5 hours ago', type: 'analytics' },
];

const DashboardPage = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Here's what's happening with your AI workspace.</p>
                </div>
                <Link
                    to="/dashboard/chat"
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
                >
                    <HiOutlineSparkles className="w-4 h-4" />
                    New AI Chat
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl p-5 border border-slate-200 card-hover"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link
                            to="/dashboard/chat"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">Start AI Chat</p>
                                <p className="text-xs text-slate-400">Ask anything to your AI assistant</p>
                            </div>
                        </Link>
                        <Link
                            to="/dashboard/analytics"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <HiOutlineChartBarSquare className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">Upload Dataset</p>
                                <p className="text-xs text-slate-400">Get AI-powered insights</p>
                            </div>
                        </Link>
                        <Link
                            to="/dashboard/subscription"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <HiOutlineArrowTrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">Upgrade Plan</p>
                                <p className="text-xs text-slate-400">Unlock more AI power</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="space-y-1">
                        {recentActivity.map((activity, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${activity.type === 'chat' ? 'bg-blue-500' :
                                        activity.type === 'analytics' ? 'bg-indigo-500' : 'bg-emerald-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm text-slate-700">{activity.action}</p>
                                        <p className="text-xs text-slate-400">{activity.item}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
