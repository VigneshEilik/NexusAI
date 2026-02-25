import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { useLoginMutation } from '../store/api/authApi';
import toast from 'react-hot-toast';
import {
    HiOutlineSparkles,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineMagnifyingGlass,
    HiOutlineBell,
    HiOutlineChartBar,
    HiOutlineDocumentText,
    HiOutlineHeart,
    HiOutlineBolt,
    HiOutlineCheckBadge,
} from 'react-icons/hi2';

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

    return (
        <div className="min-h-screen flex">
            {/* ===== LEFT PANEL - Blue Hero ===== */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1e40af 0%, #2563eb 40%, #3b82f6 100%)' }}>
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-16 left-12 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-24 right-8 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }} />
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-14">
                        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <HiOutlineSparkles className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">NexusAI</h1>
                    </div>

                    {/* Tagline */}
                    <h2 className="text-4xl xl:text-[2.75rem] font-bold text-white leading-tight mb-3">
                        Unlock the Power of
                    </h2>
                    <h2 className="text-4xl xl:text-[2.75rem] font-bold text-blue-200 leading-tight mb-5">
                        Intelligent AI
                    </h2>
                    <p className="text-blue-100/80 text-base mb-12 max-w-sm leading-relaxed">
                        Join thousands of professionals who transformed their workflow with our AI platform
                    </p>

                    {/* Illustration search bar mockup */}
                    <div className="relative mb-6">
                        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 max-w-sm">
                            <HiOutlineHeart className="w-5 h-5 text-blue-200 shrink-0" />
                            <span className="text-white/90 text-sm font-medium">Discover Your AI Workspace</span>
                        </div>
                        <div className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <HiOutlineMagnifyingGlass className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Floating card rows */}
                    <div className="space-y-3 max-w-sm mb-10">
                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/10 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <HiOutlineChartBar className="w-4 h-4 text-blue-200" />
                            </div>
                            <div className="flex-1">
                                <div className="h-2 bg-white/20 rounded-full w-3/4" />
                                <div className="h-2 bg-white/10 rounded-full w-1/2 mt-1.5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/10 animate-slide-in-left" style={{ animationDelay: '0.25s' }}>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <HiOutlineDocumentText className="w-4 h-4 text-blue-200" />
                            </div>
                            <div className="flex-1">
                                <div className="h-2 bg-white/20 rounded-full w-2/3" />
                                <div className="h-2 bg-white/10 rounded-full w-2/5 mt-1.5" />
                            </div>
                        </div>
                    </div>

                    {/* WHAT YOU GET section */}
                    <div>
                        <p className="text-xs uppercase tracking-widest text-blue-200/70 font-semibold mb-4">What you get</p>
                        <div className="flex items-center gap-6">
                            {[
                                { icon: HiOutlineBell, label: 'Get Notified' },
                                { icon: HiOutlineBolt, label: 'Track Status' },
                                { icon: HiOutlineCheckBadge, label: 'AI Insights' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 group-hover:bg-white/20 transition-colors">
                                        <item.icon className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-[11px] text-blue-200/80 font-medium uppercase tracking-wide">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RIGHT PANEL - White Form ===== */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-12 bg-white">
                <div className="w-full max-w-md animate-slide-in-right">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <HiOutlineSparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-blue-600">NexusAI</span>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Welcome Back!</h2>
                        <p className="text-slate-500 mt-1.5 text-sm">Sign in to continue your journey</p>
                    </div>

                    {/* User / Admin Toggle */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex rounded-full border border-slate-200 p-1 bg-slate-50">
                            <button
                                onClick={() => setIsAdmin(false)}
                                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${!isAdmin
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                User
                            </button>
                            <button
                                onClick={() => setIsAdmin(true)}
                                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${isAdmin
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs text-slate-400 font-medium">sign in with email</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                />
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    @
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <HiOutlineEyeSlash className="w-5 h-5" />
                                    ) : (
                                        <HiOutlineEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 text-white font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In to Continue'
                            )}
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            Create one now
                        </Link>
                    </p>

                    {/* Powered by footer */}
                    <div className="mt-10 text-center">
                        <p className="text-xs text-slate-400">Powered by</p>
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <HiOutlineSparkles className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-bold text-slate-700">NexusAI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
