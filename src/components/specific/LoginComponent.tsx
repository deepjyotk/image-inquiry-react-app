import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config.js'; // Ensure you have your config file set up

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const performLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, { email, password });
      if (response.status === 200) {
        const idToken = response.data.data.AuthenticationResult.IdToken;
        localStorage.setItem('idToken', idToken);
        toast.success('Login successful');
        setTimeout(() => {
          navigate('/search'); // Navigate to the desired page after successful login
        }, 3000); // Wait for 3 seconds before redirecting
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'User account not confirmed') {
        await handleUnconfirmedAccount(email);
      } else {
        console.error('Login failed:', error);
        toast.error('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const handleUnconfirmedAccount = async (email: string) => {
    try {
      const confirmResponse = await axios.post(`${config.API_BASE_URL}/auth/request_confirm_code`, { email });
      if (confirmResponse.status === 200) {
        toast.success('Confirmation code sent. Please check your email.');
        setTimeout(() => {
          const dataToPass = { email };
          navigate('/enter_otp', { state: { ...dataToPass } }); // Navigate to the enter_otp component
        }, 3000);
      }
    } catch (confirmError) {
      console.error('Request confirm code failed:', confirmError);
      toast.error('Failed to send confirmation code. Please try again.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleBypassAuthentication = async () => {
    await performLogin('kapoordeepjyotsingh29@gmail.com', 'Abcd@1234');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-background rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleBypassAuthentication}
            className="w-full py-2 px-4 mt-4 bg-secondary text-background rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Bypass Authentication (Testing)
          </button>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => navigate('/forgot_password')}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginComponent;
