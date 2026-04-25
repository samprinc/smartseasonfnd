import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import StatusBadge from '../components/StatusBadge';
import TopNavLayout from '../components/TopNavLayout';
import CreateFieldModal from '../components/CreateFieldModal';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('fields');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Data States
    const [fields, setFields] = useState([]);
    const [users, setUsers] = useState([]);
    const [updates, setUpdates] = useState([]);
    
    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [fieldsRes, usersRes, updatesRes] = await Promise.all([
                api.get('/fields/'),
                api.get('/users/').catch(() => ({ data: [] })), 
                api.get('/updates/').catch(() => ({ data: [] }))
            ]);
            setFields(fieldsRes.data);
            setUsers(usersRes.data);
            setUpdates(updatesRes.data);
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchDashboardData();
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await api.patch(`/users/${userId}/`, { role: newRole });
            alert("Role updated successfully!");
            fetchDashboardData();
        } catch (err) {
            alert("Failed to update role.");
        }
    };

    const stats = { 
        total: fields.length, 
        active: fields.filter(f => f.current_status === 'Active').length,
        atRisk: fields.filter(f => f.current_status === 'At Risk').length,
        completed: fields.filter(f => f.stage === 'harvested').length 
    };

    return (
        <TopNavLayout role="admin" currentTab={activeTab} setCurrentTab={setActiveTab}>
            {isCreateModalOpen && (
                <CreateFieldModal 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onSuccess={handleCreateSuccess} 
                    agents={users} 
                />
            )}

            {error && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                    <p className="font-bold">System Error</p>
                    <p>{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'fields' && (
                        <div className="animate-fade-in">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                                <h2 className="text-2xl font-bold text-gray-800">Field Operations</h2>
                                <button 
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                                >
                                    + Register New Field
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Total</p>
                                    <h2 className="text-2xl font-bold">{stats.total}</h2>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Active</p>
                                    <h2 className="text-2xl font-bold text-green-600">{stats.active}</h2>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                                    <p className="text-gray-500 text-xs uppercase font-bold">At Risk</p>
                                    <h2 className="text-2xl font-bold text-red-600">{stats.atRisk}</h2>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Done</p>
                                    <h2 className="text-2xl font-bold text-blue-600">{stats.completed}</h2>
                                </div>
                            </div>

                            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="p-4 text-xs font-semibold text-gray-500">Name</th>
                                                <th className="p-4 text-xs font-semibold text-gray-500">Crop</th>
                                                <th className="p-4 text-xs font-semibold text-gray-500">Stage</th>
                                                <th className="p-4 text-xs font-semibold text-gray-500">Agent</th>
                                                <th className="p-4 text-xs font-semibold text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fields.map(f => (
                                                <tr key={f.id} className="border-b hover:bg-gray-50">
                                                    <td className="p-4 text-sm">{f.name}</td>
                                                    <td className="p-4 text-sm">{f.crop_type}</td>
                                                    <td className="p-4 text-sm capitalize">{f.stage}</td>
                                                    <td className="p-4 text-sm">{f.agent_name || 'Unassigned'}</td>
                                                    <td className="p-4"><StatusBadge status={f.current_status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                   {/* --- TAB 2: UPDATES LOG --- */}
                    {activeTab === 'updates' && (
                        <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
                            {updates.length === 0 ? (
                                <div className="bg-white p-8 text-center rounded-xl shadow-sm border border-gray-200 text-gray-500">
                                    No updates have been logged by agents yet.
                                </div>
                            ) : (
                                updates.map(u => {
                                    // Cross-reference the fields array to get the exact Field Name and Agent Name
                                    const relatedField = fields.find(f => f.id === u.field);
                                    const fieldName = relatedField ? relatedField.name : `Field #${u.field}`;
                                    const agentName = relatedField?.agent_name || 'Unassigned Agent';

                                    return (
                                        <div key={u.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                                                <div className="mb-2 sm:mb-0">
                                                    <span className="font-bold text-gray-800 text-lg">{fieldName}</span>
                                                    <span className="text-gray-500 text-sm mx-2">updated by</span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        👤 {agentName}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                    {new Date(u.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-sm text-gray-600 font-medium">New Stage:</span>
                                                <span className="text-xs font-bold uppercase px-2 py-1 bg-green-100 text-green-800 rounded">
                                                    {u.stage_at_update}
                                                </span>
                                            </div>

                                            {/* Render notes only if the agent actually typed them */}
                                            {u.notes && (
                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 border-l-4 border-l-green-500">
                                                    <p className="text-gray-700 text-sm italic">"{u.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="bg-white shadow rounded-xl overflow-hidden">
                            {/* Optional: Kept the header inside the card for cleaner mobile view */}
                            <div className="p-4 sm:p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800">Agent Roster</h2>
                            </div>
                            
                            {/* Responsive Wrapper */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="p-4 text-sm font-semibold text-gray-600">Username</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">System Role</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-sm text-gray-800 font-medium">
                                                    {user.username}
                                                </td>
                                                <td className="p-4">
                                                    <select 
                                                        id={`role-${user.id}`}
                                                        defaultValue={user.role}
                                                        className="border border-gray-300 p-1.5 rounded text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="agent">Field Agent</option>
                                                    </select>
                                                </td>
                                                <td className="p-4">
                                                    <button 
                                                        onClick={() => handleUpdateRole(user.id, document.getElementById(`role-${user.id}`).value)}
                                                        className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                                                    >
                                                        Save Role
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </TopNavLayout>
    );
}