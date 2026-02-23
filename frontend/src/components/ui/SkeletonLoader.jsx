const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className="rounded-2xl p-6 bg-white dark:bg-slate-800 shadow-sm">
                        <div className="skeleton h-4 w-3/4 mb-4" />
                        <div className="skeleton h-3 w-full mb-2" />
                        <div className="skeleton h-3 w-5/6 mb-4" />
                        <div className="skeleton h-8 w-1/3" />
                    </div>
                );
            case 'chat':
                return (
                    <div className="flex gap-3 p-4">
                        <div className="skeleton h-10 w-10 rounded-full shrink-0" />
                        <div className="flex-1">
                            <div className="skeleton h-3 w-1/4 mb-2" />
                            <div className="skeleton h-3 w-full mb-1" />
                            <div className="skeleton h-3 w-3/4" />
                        </div>
                    </div>
                );
            case 'table':
                return (
                    <div className="space-y-3">
                        <div className="flex gap-4">
                            <div className="skeleton h-4 w-1/4" />
                            <div className="skeleton h-4 w-1/4" />
                            <div className="skeleton h-4 w-1/4" />
                            <div className="skeleton h-4 w-1/4" />
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="flex items-center gap-4">
                        <div className="skeleton h-16 w-16 rounded-full" />
                        <div>
                            <div className="skeleton h-4 w-32 mb-2" />
                            <div className="skeleton h-3 w-48" />
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <div>
                        <div className="skeleton h-3 w-full mb-2" />
                        <div className="skeleton h-3 w-5/6 mb-2" />
                        <div className="skeleton h-3 w-4/6" />
                    </div>
                );
            default:
                return <div className="skeleton h-20 w-full rounded-xl" />;
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {Array.from({ length: count }, (_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
