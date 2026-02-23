import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
    const { sidebarCollapsed } = useSelector((state) => state.ui);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Navbar />
                <main className="p-4 lg:p-6 page-enter">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
