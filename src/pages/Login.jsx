import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login/', credentials);
            
            // Save token and role to context
            login(res.data.access, res.data.role); 
            
            // Smart Redirect based on role!
            if (res.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/agent/dashboard');
            }
            
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input 
                    className="w-full p-2 mb-4 border rounded" 
                    placeholder="Username" 
                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                />
                <input 
                    className="w-full p-2 mb-4 border rounded" 
                    type="password" 
                    placeholder="Password" 
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                />
                <button className="w-full bg-blue-600 text-white p-2 rounded">Sign In</button>
            </form>
        </div>
    );
}