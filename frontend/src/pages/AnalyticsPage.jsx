import { useState, useRef } from 'react';
import { HiOutlineArrowUpTray, HiOutlineDocumentText, HiOutlineSparkles, HiOutlineTrash } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import toast from 'react-hot-toast';

const demoChartData = [
    { name: 'Jan', value: 4000, revenue: 2400 },
    { name: 'Feb', value: 3000, revenue: 1398 },
    { name: 'Mar', value: 2000, revenue: 9800 },
    { name: 'Apr', value: 2780, revenue: 3908 },
    { name: 'May', value: 1890, revenue: 4800 },
    { name: 'Jun', value: 2390, revenue: 3800 },
];

const pieData = [
    { name: 'Sales', value: 400 },
    { name: 'Marketing', value: 300 },
    { name: 'Support', value: 200 },
    { name: 'Development', value: 278 },
];

const COLORS = ['#2563eb', '#4f46e5', '#3b82f6', '#06b6d4'];

const AnalyticsPage = () => {
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [insights, setInsights] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.name.endsWith('.csv')) {
            setFile(droppedFile);
        } else {
            toast.error('Please upload a CSV file');
        }
    };

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected) setFile(selected);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);

        setTimeout(() => {
            setInsights({
                summary: 'The dataset reveals strong growth trends in Q1 with a 23% increase in key metrics. Sales performance peaked in March with significant revenue spikes. Customer acquisition costs decreased by 15% compared to the previous quarter.',
                recommendations: [
                    'Focus marketing budget on March-April period for maximum ROI',
                    'Investigate the dip in February metrics for improvement areas',
                    'Consider expanding the sales team to capitalize on Q2 momentum',
                    'Implement automated follow-ups for the support category',
                ],
            });
            setIsAnalyzing(false);
            toast.success('Analysis complete!');
        }, 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Analytics</h1>
                <p className="text-slate-500 mt-1">Upload CSV files and get AI-powered insights</p>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white ${isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-blue-400'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {file ? (
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <HiOutlineDocumentText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-900">{file.name}</p>
                            <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <HiOutlineTrash className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <HiOutlineSparkles className="w-4 h-4" />
                                    Analyze with AI
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div>
                        <HiOutlineArrowUpTray className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-700 font-medium">
                            Drag & drop your CSV file here
                        </p>
                        <p className="text-sm text-slate-400 mt-1">or</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                        >
                            Browse Files
                        </button>
                    </div>
                )}
            </div>

            {/* AI Insights */}
            {insights && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-slide-in-up">
                    <div className="flex items-center gap-2 mb-4">
                        <HiOutlineSparkles className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{insights.summary}</p>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                        {insights.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                                    {i + 1}
                                </span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={demoChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={demoChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} />
                            <Legend />
                            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="revenue" fill="#93c5fd" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
