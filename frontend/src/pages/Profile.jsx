import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-lg font-semibold text-gray-900">{user.full_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg font-semibold text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">User ID</label>
            <p className="text-lg font-semibold text-gray-900">{user.id}</p>
          </div>
          
          <div className="pt-6">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
