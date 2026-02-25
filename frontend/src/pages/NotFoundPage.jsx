import { Link } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi2';

const NotFoundPage = () => (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6 animate-float shadow-lg shadow-blue-600/25">
                <HiOutlineSparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-8xl font-extrabold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
                >
                    <HiOutlineHome className="w-4 h-4" />
                    Go Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </div>
        </div>
    </div>
);

export default NotFoundPage;
