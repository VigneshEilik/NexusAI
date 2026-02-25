import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { useRegisterMutation } from '../store/api/authApi';
import toast from 'react-hot-toast';
import {
    HiOutlineSparkles,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineUser,
    HiOutlineRocketLaunch,
    HiOutlineCpuChip,
    HiOutlinePresentationChartBar,
    HiOutlineShieldCheck,
} from 'react-icons/hi2';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const result = await register(formData).unwrap();
            dispatch(setCredentials(result.data));
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err?.data?.message || 'Registration failed');
        }
    };

    const passwordStrength = () => {
        const p = formData.password;
        if (!p) return { level: 0, text: '', color: '' };
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        const levels = [
            { level: 1, text: 'Weak', color: 'bg-red-500' },
            { level: 2, text: 'Fair', color: 'bg-orange-500' },
            { level: 3, text: 'Good', color: 'bg-yellow-500' },
            { level: 4, text: 'Strong', color: 'bg-green-500' },
        ];
        return levels[score - 1] || { level: 0, text: '', color: '' };
    };

    const strength = passwordStrength();

    return (
        <div className="min-h-screen flex">
            {/* ===== LEFT PANEL - Blue Hero ===== */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1e40af 0%, #2563eb 40%, #3b82f6 100%)' }}>
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
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
                        Start Your
                    </h2>
                    <h2 className="text-4xl xl:text-[2.75rem] font-bold text-blue-200 leading-tight mb-5">
                        AI Journey Today
                    </h2>
                    <p className="text-blue-100/80 text-base mb-12 max-w-sm leading-relaxed">
                        Create your account and experience AI-powered analytics, intelligent conversations, and data-driven insights.
                    </p>

                    {/* Free plan card */}
                    <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-5 max-w-sm border border-white/10 mb-10 animate-fade-in">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <HiOutlineRocketLaunch className="w-5 h-5 text-blue-200" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">Free Forever Plan</p>
                                <p className="text-blue-200/70 text-xs">No credit card required</p>
                            </div>
                        </div>
                        <p className="text-blue-100/70 text-sm">Get started with 5 free AI conversations per day and basic analytics.</p>
                    </div>

                    {/* Feature badges */}
                    <div>
                        <p className="text-xs uppercase tracking-widest text-blue-200/70 font-semibold mb-4">Why choose us</p>
                        <div className="flex items-center gap-6">
                            {[
                                { icon: HiOutlineCpuChip, label: 'AI Powered' },
                                { icon: HiOutlinePresentationChartBar, label: 'Analytics' },
                                { icon: HiOutlineShieldCheck, label: 'Secure' },
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
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Create Your Account</h2>
                        <p className="text-slate-500 mt-1.5 text-sm">Start your free trial. No credit card needed.</p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs text-slate-400 font-medium">sign up with email</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm pr-10"
                                />
                                <HiOutlineUser className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm pr-10"
                                />
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 flex gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level ? strength.color : 'bg-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500">{strength.text}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-slate-500">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy-policy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 text-white font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            Sign in
                        </Link>
                    </p>

                    {/* Powered by footer */}
                    <div className="mt-8 text-center">
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

export default RegisterPage;
