import { Link } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineChatBubbleLeftRight, HiOutlineChartBarSquare, HiOutlineShieldCheck, HiOutlineBolt, HiOutlineGlobeAlt, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi2';

const features = [
    { icon: HiOutlineChatBubbleLeftRight, title: 'AI-Powered Chat', desc: 'Intelligent conversations powered by cutting-edge language models for instant insights.' },
    { icon: HiOutlineChartBarSquare, title: 'Data Analytics', desc: 'Upload CSV datasets and get AI-driven analysis, trends, and actionable recommendations.' },
    { icon: HiOutlineShieldCheck, title: 'Enterprise Security', desc: 'Bank-grade encryption, role-based access, and compliance-ready infrastructure.' },
    { icon: HiOutlineBolt, title: 'Lightning Fast', desc: 'Redis-cached responses, optimized queries, and CDN delivery for sub-second loads.' },
    { icon: HiOutlineGlobeAlt, title: 'Cloud Native', desc: 'Deploy anywhere — AWS, GCP, Azure. Dockerized and Kubernetes-ready.' },
    { icon: HiOutlineSparkles, title: 'Custom AI Models', desc: 'Bring your own models or use our managed Ollama integration with full control.' },
];

const plans = [
    { name: 'Free', price: '$0', period: '/forever', features: ['5 AI chats/day', 'Basic analytics', 'Community support'], cta: 'Get Started', popular: false },
    { name: 'Professional', price: '$49', period: '/month', features: ['Unlimited chats', 'Advanced analytics', 'Priority support', 'API access', 'Team features'], cta: 'Start Free Trial', popular: true },
    { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Custom models', 'Dedicated support', 'SSO & SLA', 'On-premise option'], cta: 'Contact Sales', popular: false },
];

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                                <HiOutlineSparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">NexusAI</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
                            <a href="#pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</a>
                            <Link to="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Sign In</Link>
                            <Link to="/register" className="px-5 py-2 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity btn-glow">
                                Get Started Free
                            </Link>
                        </div>
                        <Link to="/register" className="md:hidden px-4 py-2 text-sm font-medium text-white rounded-xl gradient-primary">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 gradient-hero opacity-5" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-accent/10 rounded-full blur-3xl" />

                <div className="max-w-5xl mx-auto text-center relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 mb-6 animate-fade-in">
                        <HiOutlineSparkles className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-medium text-primary-700 dark:text-primary-400">AI-Powered SaaS Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight animate-slide-in-up">
                        Transform Data Into
                        <span className="block gradient-text">Intelligent Insights</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Harness the power of AI to analyze your data, automate conversations, and make smarter decisions.
                        Built for teams who demand more from their tools.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <Link to="/register" className="px-8 py-3.5 text-base font-semibold text-white rounded-2xl gradient-primary hover:opacity-90 transition-all btn-glow flex items-center gap-2 shadow-lg shadow-primary-500/25">
                            Start Free Trial
                            <HiOutlineArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#features" className="px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-300 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                            See Features
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        {[
                            { value: '10K+', label: 'Active Users' },
                            { value: '1M+', label: 'AI Queries' },
                            { value: '99.9%', label: 'Uptime' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Everything You Need to <span className="gradient-text">Scale</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                            A complete AI platform with enterprise-grade features designed for modern teams.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={feature.title}
                                className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 card-hover"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="w-12 h-12 rounded-xl gradient-card flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Simple, Transparent <span className="gradient-text">Pricing</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                            Start free and scale as you grow. No hidden fees, no surprises.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-2xl border card-hover ${plan.popular
                                        ? 'bg-white dark:bg-slate-800 border-primary-500 shadow-xl shadow-primary-500/10'
                                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold text-white gradient-primary rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                                <div className="mt-4 mb-6">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                                    <span className="text-slate-500">{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <HiOutlineCheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/register"
                                    className={`block text-center py-3 rounded-xl font-medium transition-all ${plan.popular
                                            ? 'text-white gradient-primary hover:opacity-90 btn-glow'
                                            : 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center gradient-hero rounded-3xl p-12 md:p-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Workflow?
                        </h2>
                        <p className="text-blue-100 max-w-lg mx-auto mb-8">
                            Join thousands of teams already using NexusAI to make smarter, faster decisions.
                        </p>
                        <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-blue-50 transition-colors shadow-xl">
                            Get Started for Free
                            <HiOutlineArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                    <HiOutlineSparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-bold gradient-text">NexusAI</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                AI-powered SaaS platform for modern enterprises.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a></li>
                                <li><Link to="/login" className="hover:text-primary-600 transition-colors">Sign In</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li><Link to="/privacy-policy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Support</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
                        © {new Date().getFullYear()} NexusAI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
