import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStores } from '../services/api';

export default function StoreSelection() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select a Store</h1>
          <p className="text-lg text-gray-600">Choose a store nearby to start shopping</p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {stores.map((store) => (
            <div 
              key={store.id} 
              onClick={() => navigate(`/store/${store.id}`)}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
            >
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200">
                <img
                  src={store.image_url || "https://placehold.co/600x400"}
                  alt={store.name}
                  className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {store.location}
                </p>
                <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                  Start Shopping
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
