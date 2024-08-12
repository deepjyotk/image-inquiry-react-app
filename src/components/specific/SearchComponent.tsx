import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // or useNavigate from react-router-dom v6


const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const navigate = useNavigate(); // or useNavigate from react-router-dom v6


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);


    const token = localStorage.getItem('idToken');

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/search`,
        {
          query: query,
          custom_label: '',
        },
        {
          headers: {
            'auth-token': token ? token : ''
          }
        });

      if (response.status === 200) {
        setImageUrls(response.data); // Assuming the response has a field 'imageUrls'
        toast.success('Images fetched successfully');
      } else {
        console.error('Error fetching images:', response.statusText);
        toast.error('Error fetching images. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Handle 401 Unauthorized
        localStorage.removeItem('idToken'); // Remove the expired token
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
        
        // You may choose to navigate to the login page using a library like react-router-dom
         
      } else {
        console.error('Error:', error);
        toast.error('An error occurred while fetching images.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm mb-8">
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-text">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 p-2 w-full bg-background border border-secondary rounded focus:outline-none focus:border-primary"
            placeholder="Type your query..."
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-text rounded hover:bg-secondary focus:outline-none focus:bg-secondary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="bg-secondary p-2 rounded">
            <img src={url} alt={`Image ${index + 1}`} className="w-full h-auto rounded" />
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SearchComponent;
