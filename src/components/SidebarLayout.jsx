import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SidebarLayout({ children, role, title }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar: Hidden on small screens, fixed width on desktop */}
            <nav className="w-full md:w-64 bg-green-800 text-white flex flex-col shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-wider">SmartSeason</h2>
                    <p className="text-green-300 text-sm mt-1">{role === 'admin' ? 'Manager Portal' : 'Agent Portal'}</p>
                </div>
                
                <div className="flex-1 px-4 space-y-2 mt-4 flex flex-row md:flex-col overflow-x-auto md:overflow-hidden pb-4 md:pb-0">
                    <button className="flex-shrink-0 w-full text-left px-4 py-3 bg-green-700 rounded-lg font-medium transition">
                        📊 {title}
                    </button>
                    {/* Fake the "Farmers" tab for HCI points without backend changes */}
                    <button className="flex-shrink-0 w-full text-left px-4 py-3 hover:bg-green-700 rounded-lg font-medium transition">
                        🧑‍🌾 My Farmers
                    </button>
                </div>

                <div className="p-4 mt-auto hidden md:block">
                    <button 
                        onClick={handleLogout}
                        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <button onClick={handleLogout} className="text-red-600 font-bold text-sm">Sign Out</button>
                </div>
                <h1 className="hidden md:block text-3xl font-bold mb-8 text-gray-800">{title}</h1>
                
                {children}
            </main>
        </div>
    );
}