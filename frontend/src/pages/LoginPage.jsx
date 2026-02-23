import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { useLoginMutation } from '../store/api/authApi';
import toast from 'react-hot-toast';
import { HiOutlineSparkles, HiOutlineEye, HiOutlineEyeSlash, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineChatBubbleLeftRight, HiOutlineChartBarSquare, HiOutlineBolt } from 'react-icons/hi2';

const LoginPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials(result.data));
            toast.success('Welcome back!');
            navigate(isAdmin ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err?.data?.message || 'Login failed');
        }
    };

    const features = [
        { icon: HiOutlineChatBubbleLeftRight, text: 'AI-Powered Conversations' },
        { icon: HiOutlineChartBarSquare, text: 'Smart Data Analytics' },
        { icon: HiOutlineBolt, text: 'Real-time Insights' },
        { icon: HiOutlineCheckCircle, text: 'Enterprise Security' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-40 right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" />
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <HiOutlineSparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">NexusAI</h1>
                            <p className="text-xs text-blue-200">Enterprise Platform</p>
                        </div>
                    </div>

                    {/* Tagline */}
                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                        Unlock the Power of
                        <span className="block text-cyan-300">Intelligent AI</span>
                    </h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-md leading-relaxed">
                        Transform your workflow with AI-driven insights, automated analysis, and smart conversations.
                    </p>

                    {/* Feature cards */}
                    <div className="space-y-3">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="glass flex items-center gap-4 px-5 py-3.5 rounded-2xl animate-slide-in-left"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <f.icon className="w-5 h-5 text-cyan-300" />
                                </div>
                                <span className="text-white font-medium text-sm">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
                <div className="w-full max-w-md animate-slide-in-right">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <HiOutlineSparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">NexusAI</span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to continue to your account</p>
                    </div>

                    {/* User/Admin Toggle */}
                    <div className="mt-6 flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                        <button
                            onClick={() => setIsAdmin(false)}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${!isAdmin
                                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            User
                        </button>
                        <button
                            onClick={() => setIsAdmin(true)}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${isAdmin
                                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 text-white font-semibold rounded-xl gradient-primary hover:opacity-90 transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25 text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                `Sign in as ${isAdmin ? 'Admin' : 'User'}`
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
