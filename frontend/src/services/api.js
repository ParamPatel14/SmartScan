import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getStores = async () => {
  const response = await api.get('/stores/');
  return response.data;
};

export const getStore = async (id) => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

export const getProducts = async (storeId) => {
  const response = await api.get(`/products/?store_id=${storeId}`);
  return response.data;
};

export const searchProducts = async (query, storeId = null) => {
  let url = `/products/search?q=${query}`;
  if (storeId) {
    url += `&store_id=${storeId}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getProductByBarcode = async (barcode) => {
  const response = await api.get(`/products/barcode/${barcode}`);
  return response.data;
};

// Cart APIs
export const getCart = async () => {
  const response = await api.get('/cart/');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart/items', { product_id: productId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/items/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart/');
  return response.data;
};

export default api;
