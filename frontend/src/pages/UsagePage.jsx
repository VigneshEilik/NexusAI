import { useSelector } from 'react-redux';
import { useGetUsageQuery } from '../store/api/workspaceApi';
import {
    HiOutlineChartPie, HiOutlineSparkles, HiOutlineTableCells,
    HiOutlineArrowPath, HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

const UsagePage = () => {
    const { activeWorkspace } = useSelector((state) => state.workspace);
    const { data, isLoading } = useGetUsageQuery(
        activeWorkspace?._id,
        { skip: !activeWorkspace }
    );

    const usage = data?.data?.usage || {};
    const limits = data?.data?.limits || {};

    const metrics = [
        {
            label: 'AI Requests',
            icon: HiOutlineSparkles,
            used: usage.ai_request || 0,
            limit: limits.aiRequestsPerMonth || 0,
            color: 'blue',
        },
        {
            label: 'Rows Processed',
            icon: HiOutlineTableCells,
            used: usage.row_processed || 0,
            limit: limits.maxRowsPerMonth || 0,
            color: 'indigo',
        },
        {
            label: 'Pipeline Runs',
            icon: HiOutlineArrowPath,
            used: usage.pipeline_run || 0,
            limit: limits.maxPipelines || 0,
            color: 'violet',
        },
    ];

    const colorMap = {
        blue: {
            bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
            bar: 'bg-blue-500', barBg: 'bg-blue-100',
        },
        indigo: {
            bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600',
            bar: 'bg-indigo-500', barBg: 'bg-indigo-100',
        },
        violet: {
            bg: 'bg-violet-50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600',
            bar: 'bg-violet-500', barBg: 'bg-violet-100',
        },
    };

    if (!activeWorkspace) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <HiOutlineChartPie className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">No Workspace Selected</h2>
                <p className="text-slate-500 mt-2">Select a workspace to view usage stats.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Usage Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Current billing period usage for <span className="font-medium text-slate-700">{activeWorkspace.name}</span>
                </p>
            </div>

            {/* Plan Badge */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <HiOutlineArrowTrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">
                            Current Plan: <span className="capitalize text-blue-600">{activeWorkspace.subscriptionPlan || 'Free'}</span>
                        </p>
                        <p className="text-xs text-slate-400">Resets at the start of each month</p>
                    </div>
                </div>
                <a
                    href="/dashboard/subscription"
                    className="text-sm text-blue-600 font-medium hover:underline"
                >
                    Upgrade Plan →
                </a>
            </div>

            {/* Usage Cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-40 skeleton rounded-xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {metrics.map((m) => {
                        const c = colorMap[m.color];
                        const pct = m.limit > 0 ? Math.min((m.used / m.limit) * 100, 100) : 0;
                        const isWarning = pct > 80;

                        return (
                            <div key={m.label} className={`rounded-xl border border-slate-200 p-5 ${c.bg} card-hover`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                                        <m.icon className={`w-5 h-5 ${c.iconColor}`} />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-700">{m.label}</h3>
                                </div>

                                <div className="flex items-end justify-between mb-3">
                                    <p className="text-3xl font-bold text-slate-900">
                                        {m.used.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        / {m.limit.toLocaleString()}
                                    </p>
                                </div>

                                {/* Progress bar */}
                                <div className={`h-2 rounded-full ${c.barBg}`}>
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${isWarning ? 'bg-red-500' : c.bar}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <p className={`text-xs mt-2 ${isWarning ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                                    {pct.toFixed(1)}% used
                                    {isWarning && ' — Consider upgrading'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UsagePage;
