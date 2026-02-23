import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi2';

const PrivacyPolicyPage = () => (
    <div className="min-h-screen bg-white dark:bg-slate-950">
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <HiOutlineSparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold gradient-text">NexusAI</span>
                </Link>
            </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-slate-400 mb-8">Last updated: February 22, 2026</p>

            <div className="prose dark:prose-invert max-w-none space-y-6">
                {[
                    { title: '1. Information We Collect', content: 'We collect information you provide directly, such as your name, email address, and usage data. We also automatically collect technical information about your device and how you interact with our platform, including IP address, browser type, and cookies.' },
                    { title: '2. How We Use Your Information', content: 'We use the information we collect to provide and improve our services, communicate with you, process transactions, and personalize your experience. We may also use data for analytics and security purposes.' },
                    { title: '3. Data Storage & Security', content: 'Your data is stored securely using industry-standard encryption. We implement administrative, technical, and physical safeguards to protect your information. All AI interactions are processed securely and cached responses are encrypted.' },
                    { title: '4. Third-Party Services', content: 'We may use third-party services for analytics, payment processing, and AI model hosting. These services have their own privacy policies and we encourage you to review them.' },
                    { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data. You may also opt out of certain data collection practices. Contact us at privacy@nexusai.com for any requests.' },
                    { title: '6. Cookies', content: 'We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings.' },
                    { title: '7. Changes to This Policy', content: 'We may update this privacy policy from time to time. We will notify you of any significant changes via email or through the platform.' },
                    { title: '8. Contact Us', content: 'If you have questions about this privacy policy, contact us at privacy@nexusai.com.' },
                ].map((section) => (
                    <div key={section.title}>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{section.title}</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default PrivacyPolicyPage;
