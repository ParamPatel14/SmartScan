import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios default header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/me');
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);
      const accessToken = response.data.access_token;
      
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Fetch user data immediately
      const userResponse = await axios.get('http://127.0.0.1:8000/users/me');
      setUser(userResponse.data);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      await axios.post('http://127.0.0.1:8000/auth/register', {
        email,
        password,
        full_name: fullName
      });
      // Automatically login after register
      return await login(email, password);
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
