import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import StatusBadge from '../components/StatusBadge';
import TopNavLayout from '../components/TopNavLayout';
import UpdateModal from '../components/UpdateModal';

export default function AgentDashboard() {
    const [activeTab, setActiveTab] = useState('fields');
    
    // Data States
    const [fields, setFields] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    
    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAgentData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch both fields and the agent's update history simultaneously
            const [fieldsRes, updatesRes] = await Promise.all([
                api.get('/fields/'),
                api.get('/updates/').catch(() => ({ data: [] })) // Safe fallback
            ]);
            setFields(fieldsRes.data);
            setUpdates(updatesRes.data);
        } catch (err) {
            console.error("Agent fetch error:", err);
            setError("Failed to load your dashboard data. Please check your network connection.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentData();
    }, []);

    // Refresh data after a successful modal submission
    const handleUpdateSuccess = () => {
        setSelectedField(null);
        fetchAgentData();
    };

    // Agent Specific Metrics
    const stats = {
        total: fields.length,
        active: fields.filter(f => f.current_status === 'Healthy').length,
        atRisk: fields.filter(f => f.current_status === 'At Risk').length
    };

    // Helper to find the last update for a specific field
    const getLastUpdateDate = (fieldId) => {
        const fieldUpdates = updates.filter(u => u.field === fieldId);
        if (fieldUpdates.length === 0) return 'No updates yet';
        
        // Sort by newest first and grab the date
        const newest = fieldUpdates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
        return new Date(newest.created_at).toLocaleDateString();
    };

    return (
        <TopNavLayout role="agent">
            
            {/* The Modal */}
            {selectedField && (
                <UpdateModal 
                    field={selectedField} 
                    onClose={() => setSelectedField(null)} 
                    onSuccess={handleUpdateSuccess} 
                />
            )}

            {/* --- GLOBAL ERROR STATE --- */}
            {error && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                    <p className="font-bold">Connection Error</p>
                    <p>{error}</p>
                </div>
            )}

            {/* --- LOCAL TABS FOR AGENT --- */}
            <div className="flex space-x-2 border-b border-gray-200 mb-6">
                <button 
                    onClick={() => setActiveTab('fields')}
                    className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'fields' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Assigned Fields
                </button>
                <button 
                    onClick={() => setActiveTab('updates')}
                    className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'updates' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Update History
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20 animate-pulse">
                    <div className="h-12 w-12 border-4 border-green-200 border-t-green-800 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* --- TAB 1: ASSIGNED FIELDS --- */}
                    {activeTab === 'fields' && (
                        <div className="animate-fade-in">
                            {/* Metrics Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                    <p className="text-gray-500 text-sm font-medium">Total Assigned</p>
                                    <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
                                    <p className="text-gray-500 text-sm font-medium">Healthy Fields</p>
                                    <h2 className="text-3xl font-bold text-green-600">{stats.active}</h2>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500">
                                    <p className="text-gray-500 text-sm font-medium">Fields At Risk</p>
                                    <h2 className="text-3xl font-bold text-red-600">{stats.atRisk}</h2>
                                </div>
                            </div>

                            {fields.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                                    <p className="text-gray-500 text-lg">No fields assigned to you currently.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fields.map(field => (
                                        <div key={field.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col">
                                            <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                                                <h2 className="text-lg font-bold text-gray-800 truncate pr-2">{field.name}</h2>
                                                <StatusBadge status={field.current_status} />
                                            </div>
                                            
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="space-y-2 mb-6 flex-grow">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Crop</span>
                                                        <span className="font-semibold text-gray-800">{field.crop_type}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Stage</span>
                                                        <span className="font-semibold text-gray-800">{field.stage}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Planted</span>
                                                        {/* Fallback to 'Not recorded' if your Django model lacks planting_date */}
                                                        <span className="font-medium text-gray-800">{field.planting_date || 'Not recorded'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm pt-2 mt-2 border-t border-gray-100">
                                                        <span className="text-gray-500 text-xs uppercase">Last Updated</span>
                                                        <span className="font-medium text-blue-600 text-xs">{getLastUpdateDate(field.id)}</span>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => setSelectedField(field)}
                                                    className="w-full bg-green-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors shadow-sm mt-auto"
                                                >
                                                    Log New Update
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB 2: UPDATE HISTORY --- */}
                    {activeTab === 'updates' && (
                        <div className="animate-fade-in max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Logged Updates</h2>
                            
                            <div className="space-y-4">
                                {updates.length === 0 ? (
                                    <div className="bg-white p-8 text-center rounded-xl shadow-sm border border-gray-200 text-gray-500">
                                        You haven't logged any field updates yet.
                                    </div>
                                ) : (
                                    // Sort by newest first
                                    updates.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(update => (
                                        <div key={update.id} className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-bold text-gray-800">Field #{update.field}</span>
                                                    <span className="text-gray-500 text-sm mx-2">updated to stage:</span>
                                                    <span className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded text-sm">{update.stage_at_update}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                                                    {new Date(update.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {update.notes && (
                                                <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    "{update.notes}"
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </TopNavLayout>
    );
}