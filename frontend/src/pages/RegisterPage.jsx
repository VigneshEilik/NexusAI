import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { useRegisterMutation } from '../store/api/authApi';
import toast from 'react-hot-toast';
import { HiOutlineSparkles, HiOutlineEye, HiOutlineEyeSlash, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi2';

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
            {/* Left side - Hero */}
            <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <HiOutlineSparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">NexusAI</h1>
                            <p className="text-xs text-blue-200">Enterprise Platform</p>
                        </div>
                    </div>
                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                        Start Your
                        <span className="block text-cyan-300">AI Journey Today</span>
                    </h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-md leading-relaxed">
                        Create your account and experience AI-powered analytics, intelligent conversations, and data-driven insights.
                    </p>
                    <div className="glass rounded-2xl p-6 max-w-sm animate-fade-in">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-lg">🚀</span>
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">Free Forever Plan</p>
                                <p className="text-blue-200 text-xs">No credit card required</p>
                            </div>
                        </div>
                        <p className="text-blue-100 text-sm">Get started with 5 free AI conversations per day and basic analytics.</p>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
                <div className="w-full max-w-md animate-slide-in-right">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <HiOutlineSparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">NexusAI</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Start your free trial. No credit card needed.</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 flex gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500">{strength.text}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                I agree to the <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                            </span>
                        </div>

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 text-white font-semibold rounded-xl gradient-primary hover:opacity-90 transition-all btn-glow disabled:opacity-50 shadow-lg shadow-primary-500/25 text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
