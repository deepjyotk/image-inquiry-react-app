import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // or useNavigate from react-router-dom v6
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config.js'; // Ensure you have your config file set up

const RegisterComponent: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate(); // or useNavigate from react-router-dom v6

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    } else {
      setPasswordError("");
    }

    const name = `${firstName} ${lastName}`;

    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/register`, {
        name,
        password,
        email
      });
      if (response.status === 200) {
        const dataToPass  = {
          email: email
        }; 
        navigate('/enter_otp', {state: {...dataToPass} });// or navigate('/create_otp') for react-router-dom v6
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error('Already registered, please login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Wait for 3 seconds before redirecting to the login page
      } else {
        console.error('Registration failed:', error);
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Register</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
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
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-background rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Register
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterComponent;
