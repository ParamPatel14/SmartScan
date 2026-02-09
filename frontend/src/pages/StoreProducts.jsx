import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getStore, getProducts, searchProducts, getProductByBarcode, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StoreProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeData, productsData] = await Promise.all([
          getStore(id),
          getProducts(id)
        ]);
        setStore(storeData);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to load store data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      const allProducts = await getProducts(id);
      setProducts(allProducts);
      return;
    }
    try {
      const results = await searchProducts(searchQuery, id);
      setProducts(results);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    if (!barcodeQuery.trim()) return;
    try {
      const product = await getProductByBarcode(barcodeQuery);
      setProducts([product]);
      setError(null);
    } catch (error) {
      setError("Product not found with this barcode");
      setProducts([]); 
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
    setBarcodeQuery('');
    setError(null);
    const allProducts = await getProducts(id);
    setProducts(allProducts);
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      if (window.confirm("You need to log in to add items to your cart. Go to login page?")) {
        navigate('/login', { state: { from: location, productToAdd: product } });
      }
      return;
    }

    setAddingToCart(product.id);
    try {
      await addToCart(product.id, 1);
      // Optional: Show toast or feedback
      alert(`Added ${product.name} to cart!`);
    } catch (error) {
      console.error("Failed to add to cart", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate('/login', { state: { from: location, productToAdd: product } });
      } else {
        alert("Failed to add item to cart.");
      }
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!store) return <div className="text-center mt-20">Store not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button onClick={() => navigate('/stores')} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                <p className="text-sm text-gray-500">{store.location}</p>
              </div>
            </div>
            
            {/* Cart Icon */}
            <div 
              className="relative p-2 cursor-pointer hover:bg-gray-100 rounded-full"
              onClick={() => navigate('/cart')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {/* Optional: Add cart count here later */}
                Go
              </span>
            </div>
          </div>

          {/* Search Bars */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </form>

            <form onSubmit={handleBarcodeSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Scan barcode..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
              </svg>
            </form>
            
            {(searchQuery || barcodeQuery) && (
              <button onClick={clearSearch} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                Clear
              </button>
            )}
          </div>
          
          {error && <div className="mt-2 text-red-600 text-sm font-medium">{error}</div>}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-12">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-y-8 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-200 lg:aspect-none lg:h-48">
                  <img
                    src={product.image_url || "https://placehold.co/300x300"}
                    alt={product.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</p>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart === product.id}
                      className={`p-2 rounded-full transition-colors ${
                        addingToCart === product.id 
                          ? 'bg-gray-100 text-gray-400 cursor-wait' 
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    #{product.barcode}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
