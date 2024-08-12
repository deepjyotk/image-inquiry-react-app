// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/search" className="text-white text-lg hover:text-gray-300">
          Search
        </Link>
        <Link to="/upload" className="text-white text-lg hover:text-gray-300">
          Upload
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
