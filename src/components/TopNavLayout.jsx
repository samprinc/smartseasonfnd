import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNavLayout({ children, role, currentTab, setCurrentTab }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation Bar */}
            <header className="bg-green-800 text-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Branding */}
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold tracking-tight">SmartSeason</h1>
                            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-700 text-green-100">
                                {role === 'admin' ? 'Manager Portal' : 'Agent Portal'}
                            </span>
                        </div>

                        {/* Navigation Tabs (Admin Only) */}
                        {role === 'admin' && setCurrentTab && (
                            <nav className="hidden md:flex space-x-1">
                                <button 
                                    onClick={() => setCurrentTab('fields')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${currentTab === 'fields' ? 'bg-green-900 text-white' : 'hover:bg-green-700'}`}
                                >
                                    Fields Overview
                                </button>
                                <button 
                                    onClick={() => setCurrentTab('team')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${currentTab === 'team' ? 'bg-green-900 text-white' : 'hover:bg-green-700'}`}
                                >
                                    Team Management
                                </button>
                            </nav>
                        )}

                        {/* Logout Button */}
                        <button 
                            onClick={handleLogout}
                            className="text-green-100 hover:text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
                
                {/* Mobile Navigation Row (Admin Only) */}
                {role === 'admin' && setCurrentTab && (
                    <div className="md:hidden flex border-t border-green-700 bg-green-800">
                        <button onClick={() => setCurrentTab('fields')} className={`flex-1 py-3 text-sm font-medium text-center ${currentTab === 'fields' ? 'bg-green-900' : ''}`}>
                            Fields
                        </button>
                        <button onClick={() => setCurrentTab('updates')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${currentTab === 'updates' ? 'bg-green-900 text-white' : 'hover:bg-green-700'}`}
                        >
                            Updates Log
                        </button>
                        <button onClick={() => setCurrentTab('team')} className={`flex-1 py-3 text-sm font-medium text-center ${currentTab === 'team' ? 'bg-green-900' : ''}`}>
                            Team
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}