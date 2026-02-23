import { Link } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi2';

const NotFoundPage = () => (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-float">
                <HiOutlineSparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-all btn-glow shadow-lg shadow-primary-500/25"
                >
                    <HiOutlineHome className="w-4 h-4" />
                    Go Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </div>
        </div>
    </div>
);

export default NotFoundPage;
