import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetPipelinesQuery, useUploadCsvPipelineMutation } from '../store/api/workspaceApi';
import {
    HiOutlineArrowPath, HiOutlineCloudArrowUp, HiOutlineClock,
    HiOutlineCheckCircle, HiOutlineXCircle, HiOutlinePlayCircle,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const statusStyles = {
    active: { icon: HiOutlineCheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Active' },
    running: { icon: HiOutlinePlayCircle, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Running' },
    paused: { icon: HiOutlineClock, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Paused' },
    failed: { icon: HiOutlineXCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Failed' },
};

const PipelinesPage = () => {
    const { activeWorkspace } = useSelector((state) => state.workspace);
    const { data, isLoading } = useGetPipelinesQuery(
        {},
        { skip: !activeWorkspace }
    );
    const [uploadCsv, { isLoading: isUploading }] = useUploadCsvPipelineMutation();

    const [showUpload, setShowUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');

    const pipelines = data?.data?.pipelines || [];

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a CSV file');

        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);
        if (question) formData.append('question', question);

        try {
            await uploadCsv(formData).unwrap();
            toast.success('CSV processing started!');
            setShowUpload(false);
            setFile(null);
            setTitle('');
            setQuestion('');
        } catch {
            // Error handled by toast
        }
    };

    if (!activeWorkspace) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <HiOutlineArrowPath className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">No Workspace Selected</h2>
                <p className="text-slate-500 mt-2">Create or select a workspace from the sidebar to get started.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pipelines</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Automated data processing and AI analysis workflows
                    </p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
                        bg-blue-600 hover:bg-blue-700 transition-colors btn-glow shadow-lg shadow-blue-600/25"
                >
                    <HiOutlineCloudArrowUp className="w-5 h-5" />
                    Upload CSV
                </button>
            </div>

            {/* Pipeline List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 skeleton rounded-xl" />
                    ))}
                </div>
            ) : pipelines.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <HiOutlineArrowPath className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No pipelines yet</h3>
                    <p className="text-sm text-slate-500 mt-1">Upload a CSV to create your first pipeline.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pipelines.map((pipeline) => {
                        const status = statusStyles[pipeline.status] || statusStyles.active;
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={pipeline._id}
                                className="bg-white rounded-xl border border-slate-200 p-4 card-hover"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                                            <StatusIcon className={`w-5 h-5 ${status.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-700">{pipeline.name}</h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                                <span>{pipeline.dataSource?.type?.toUpperCase() || 'CSV'}</span>
                                                <span>•</span>
                                                <span className="capitalize">{pipeline.schedule}</span>
                                                {pipeline.lastRunAt && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Last run: {new Date(pipeline.lastRunAt).toLocaleDateString()}</span>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowUpload(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Upload CSV</h3>
                        <p className="text-sm text-slate-500 mb-5">Upload a CSV file to start a processing pipeline with AI insights.</p>

                        <form onSubmit={handleUpload} className="space-y-4">
                            {/* File Input */}
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
                                <HiOutlineCloudArrowUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <label className="cursor-pointer">
                                    <span className="text-sm text-blue-600 font-medium hover:underline">Choose a file</span>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                                {file && (
                                    <p className="text-xs text-slate-500 mt-2">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Title (optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2
                                    focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-700
                                    placeholder-slate-400 transition-all"
                            />

                            <textarea
                                placeholder="What would you like to know about this data? (optional)"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2
                                    focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-700
                                    placeholder-slate-400 transition-all resize-none"
                            />

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUpload(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600
                                        border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading || !file}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white
                                        bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors btn-glow"
                                >
                                    {isUploading ? 'Processing...' : 'Upload & Analyze'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PipelinesPage;
