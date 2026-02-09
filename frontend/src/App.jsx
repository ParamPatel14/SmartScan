import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [status, setStatus] = useState('Loading...');
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/health')
      .then(response => {
        setStatus(response.data.status);
        setDbStatus(response.data.database);
      })
      .catch(err => {
        console.error(err);
        setStatus('Error');
        setDbStatus('Error');
        setError('Failed to connect to backend');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-10 bg-white rounded-xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">
          System Status 🚀
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-500 uppercase font-semibold">Backend API</p>
            <p className={`text-xl font-bold ${status === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-500 uppercase font-semibold">Database Connection</p>
            <p className={`text-xl font-bold ${dbStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              {dbStatus}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
}
