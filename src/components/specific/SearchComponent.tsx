import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${config.apiBaseUrl}/search`, 
         {
          query : query,
          custom_label: '',
        });

      if (response.status === 200) {
        setImageUrls(response.data); // Assuming the response has a field 'imageUrls'
      } else {
        console.error('Error fetching images:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
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
    </div>
  );
};

export default SearchComponent;
