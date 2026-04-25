export default function StatusBadge({ status }) {
    const colors = {
        'Active': 'bg-green-100 text-green-800',
        'At Risk': 'bg-red-100 text-red-800',
        'Completed': 'bg-blue-100 text-blue-800'
    };
    
    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}