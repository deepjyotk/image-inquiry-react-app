import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // or useNavigate from react-router-dom v6
import axios from 'axios';
import config from '../../config.js'; // Ensure you have your config file set up

const EnterOtpComponent: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate(); // or useNavigate from react-router-dom v6
  const location = useLocation();
  const email = location.state?.email; 

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp(otp)) {
      setOtpError("Invalid OTP. Please enter a 6-digit OTP.");
      return;
    } else {
      setOtpError("");


      
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/confirm`, {
        email,
        confirmation_code: otp,
      });
      if (response.status === 200) {
        navigate('/login'); 
          // Navigate to the next component/page
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('OTP verification failed. Please try again.');
    }
  };

  const validateOtp = (otp: string) => {
    const regex = /^\d{6}$/;
    return regex.test(otp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Enter OTP</h1>
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
            {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-background rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterOtpComponent;
