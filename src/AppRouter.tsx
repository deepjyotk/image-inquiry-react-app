// src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/specific/LoginComponent';
import RegisterComponent from './components/specific/RegisterComponent';
import SearchComponent from './components/specific/SearchComponent';
import UploadComponent from './components/specific/UploadComponent';
import EnterOtpComponent from './components/specific/EnterOtpComponent';
import NavBar from './components/specific/NavBar';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/enter_otp" element={<EnterOtpComponent />} />
          
          {/* For routes where NavBar should be displayed */}
          <Route
            path="/search"
            element={
              <div>
                <NavBar />
                <SearchComponent />
              </div>
            }
          />
          <Route
            path="/upload"
            element={
              <div>
                <NavBar />
                <UploadComponent />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
