import { HiOutlineChatBubbleLeftRight, HiOutlineChartBarSquare, HiOutlineSparkles, HiOutlineClock, HiOutlineArrowTrendingUp, HiOutlineUserGroup } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const stats = [
    { label: 'AI Conversations', value: '128', change: '+12%', icon: HiOutlineChatBubbleLeftRight, color: 'from-blue-500 to-blue-600' },
    { label: 'Analytics Reports', value: '34', change: '+8%', icon: HiOutlineChartBarSquare, color: 'from-purple-500 to-purple-600' },
    { label: 'AI Tokens Used', value: '45.2K', change: '+23%', icon: HiOutlineSparkles, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Time Saved', value: '89h', change: '+15%', icon: HiOutlineClock, color: 'from-green-500 to-green-600' },
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your AI workspace.</p>
                </div>
                <Link
                    to="/dashboard/chat"
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-all btn-glow shadow-lg shadow-primary-500/25"
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
                        className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 card-hover"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link
                            to="/dashboard/chat"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Start AI Chat</p>
                                <p className="text-xs text-slate-400">Ask anything to your AI assistant</p>
                            </div>
                        </Link>
                        <Link
                            to="/dashboard/analytics"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <HiOutlineChartBarSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Upload Dataset</p>
                                <p className="text-xs text-slate-400">Get AI-powered insights</p>
                            </div>
                        </Link>
                        <Link
                            to="/dashboard/subscription"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <HiOutlineArrowTrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Upgrade Plan</p>
                                <p className="text-xs text-slate-400">Unlock more AI power</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-1">
                        {recentActivity.map((activity, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${activity.type === 'chat' ? 'bg-blue-500' :
                                            activity.type === 'analytics' ? 'bg-purple-500' : 'bg-green-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{activity.action}</p>
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
