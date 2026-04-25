import { useState } from 'react';
import api from '../api/axiosConfig';

export default function CreateFieldModal({ onClose, onSuccess, agents }) {
    const [formData, setFormData] = useState({
        name: '',
        crop_type: '',
        planting_date: '', 
        stage: 'planted', 
        agent: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                name: formData.name,
                crop_type: formData.crop_type,
                planting_date: formData.planting_date, 
                stage: formData.stage,
                current_status: 'Healthy'
            };
            
            // 🔥 ADDED parseInt() HERE SO DJANGO ACCEPTS THE ID 🔥
            if (formData.agent) {
                payload.assigned_to = parseInt(formData.agent, 10);
            }

            await api.post('/fields/', payload);
            onSuccess();
        } catch (err) {
            console.error("Create field error:", err);
            setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to register field.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
                <div className="bg-green-800 px-6 py-4 flex justify-between items-center text-white sticky top-0">
                    <h3 className="text-lg font-bold">Register New Field</h3>
                    <button onClick={onClose} className="text-green-200 hover:text-white font-bold text-xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm break-words">{error}</div>}

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Field Name</label>
                        <input required type="text" placeholder="e.g. North Plot B" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Crop Type</label>
                            <input required type="text" placeholder="e.g. Maize" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
                                value={formData.crop_type} onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Planting Date</label>
                            <input required type="date" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
                                value={formData.planting_date} onChange={(e) => setFormData({...formData, planting_date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Initial Stage</label>
                        <select className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
                            value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})}
                        >
                            <option value="planted">Planted</option>
                            <option value="growing">Growing</option>
                            <option value="ready">Ready</option>
                            <option value="harvested">Harvested</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Assign Agent (Optional)</label>
                        <select className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
                            value={formData.agent} onChange={(e) => setFormData({...formData, agent: e.target.value})}
                        >
                            <option value="">-- Leave Unassigned --</option>
                            {agents && agents.filter(u => u.role !== 'admin').map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium disabled:bg-green-400">
                            {isSubmitting ? 'Saving...' : 'Register Field'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}