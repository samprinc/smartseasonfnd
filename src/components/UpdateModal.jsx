import { useState } from 'react';
import api from '../api/axiosConfig';

export default function UpdateModal({ field, onClose, onSuccess }) {
    const [stage, setStage] = useState(field.stage || 'Planting');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Adjust these keys if your Django backend expects slightly different names
            await api.post('/updates/', {
                field: field.id,
                stage_at_update: stage,
                notes: notes
            });
            
            // Tell the dashboard to refresh the data
            onSuccess(); 
        } catch (err) {
            console.error(err);
            setError('Failed to log update. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                
                {/* Modal Header */}
                <div className="bg-green-800 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold">Update: {field.name}</h3>
                    <button onClick={onClose} className="text-green-200 hover:text-white font-bold text-xl">&times;</button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">New Stage</label>
                        <select 
                            value={stage} 
                            onChange={(e) => setStage(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                        >
                            <option value="planted">Planted</option>
                            <option value="growing">Growing</option>
                            <option value="ready">Ready</option>
                            <option value="harvested">Harvested</option>      </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Field Notes (Optional)</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            placeholder="Observed pests, water levels, fertilizer applied..."
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 resize-none"
                        ></textarea>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                                isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}