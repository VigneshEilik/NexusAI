import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineSparkles } from 'react-icons/hi2';

const SubscriptionPage = () => {
    const { plans, currentPlan } = useSelector((state) => state.subscription);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription & Billing</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your plan and billing details</p>
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <p className="text-blue-200 text-sm">Current Plan</p>
                    <h2 className="text-3xl font-bold mt-1 capitalize">{currentPlan}</h2>
                    <p className="text-blue-100 mt-2 text-sm">Your plan renews on March 22, 2026</p>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`rounded-2xl p-6 border card-hover relative ${currentPlan === plan.id
                                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                                : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        {currentPlan === plan.id && (
                            <span className="absolute top-4 right-4 text-xs font-medium text-primary-600 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                                Current
                            </span>
                        )}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                        <div className="mt-2 mb-4">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                            {plan.price > 0 && <span className="text-slate-500">/mo</span>}
                        </div>
                        <ul className="space-y-2 mb-6">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <HiOutlineCheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled={currentPlan === plan.id}
                            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${currentPlan === plan.id
                                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : 'gradient-primary text-white hover:opacity-90 btn-glow'
                                }`}
                        >
                            {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Billing History */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-slate-500 border-b border-slate-200 dark:border-slate-700">
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium">Description</th>
                                <th className="pb-3 font-medium">Amount</th>
                                <th className="pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[
                                { date: 'Feb 22, 2026', desc: 'Free Plan', amount: '$0.00', status: 'Active' },
                            ].map((item, i) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                                    <td className="py-3 text-slate-700 dark:text-slate-300">{item.date}</td>
                                    <td className="py-3 text-slate-700 dark:text-slate-300">{item.desc}</td>
                                    <td className="py-3 text-slate-700 dark:text-slate-300">{item.amount}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-600 rounded-full">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
