import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import StoreSelection from './pages/StoreSelection';
import StoreProducts from './pages/StoreProducts';
import Cart from './pages/Cart';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stores" element={<StoreSelection />} />
          <Route path="/store/:id" element={<StoreProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/" element={<Navigate to="/stores" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
