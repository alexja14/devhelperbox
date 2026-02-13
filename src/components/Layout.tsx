import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0 px-6 py-8 lg:px-10 lg:py-10">
                <Outlet />
            </main>
        </div>
    );
}
