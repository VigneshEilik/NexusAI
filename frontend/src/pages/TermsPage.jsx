import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi2';

const TermsPage = () => (
    <div className="min-h-screen bg-white">
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <HiOutlineSparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">NexusAI</span>
                </Link>
            </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms & Conditions</h1>
            <p className="text-sm text-slate-400 mb-8">Last updated: February 22, 2026</p>

            <div className="prose max-w-none space-y-6">
                {[
                    { title: '1. Acceptance of Terms', content: 'By accessing or using NexusAI, you agree to be bound by these terms and conditions. If you do not agree to these terms, you may not use the platform.' },
                    { title: '2. Description of Service', content: 'NexusAI provides AI-powered chat, data analytics, and business intelligence tools as a cloud-based SaaS platform. Service availability may vary by subscription plan.' },
                    { title: '3. User Accounts', content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities under your account.' },
                    { title: '4. Subscription & Billing', content: 'Paid plans are billed monthly or annually. You can cancel at any time, and your access will continue until the end of the current billing period. Refunds are handled on a case-by-case basis.' },
                    { title: '5. Acceptable Use', content: 'You agree not to use the platform for any unlawful purpose, to harass others, distribute malware, or attempt to gain unauthorized access to any part of the service.' },
                    { title: '6. Intellectual Property', content: 'All content and technology within NexusAI is owned by us or our licensors. Your data remains yours. We claim no ownership over the content you create or upload.' },
                    { title: '7. AI-Generated Content', content: 'AI-generated responses are provided for informational purposes only. We make no warranties about the accuracy, completeness, or reliability of AI outputs. Users should verify important information independently.' },
                    { title: '8. Limitation of Liability', content: 'NexusAI shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.' },
                    { title: '9. Termination', content: 'We reserve the right to terminate or suspend your account at any time for violations of these terms. You may also delete your account at any time through the settings page.' },
                    { title: '10. Contact', content: 'For questions about these terms, contact us at legal@nexusai.com.' },
                ].map((section) => (
                    <div key={section.title}>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{section.title}</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default TermsPage;
