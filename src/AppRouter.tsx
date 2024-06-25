// src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/specific/LoginComponent';
import RegisterComponent from './components/specific/RegisterComponent';
import SearchComponent from './components/specific/SearchComponent';
import UploadComponent from './components/specific/UploadComponent';
import EnterOtpComponent from './components/specific/EnterOtpComponent';


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route  path="/" element={<LoginComponent/>} />
        <Route  path="/login" element={<LoginComponent/>} />
        <Route path="/register" element={<RegisterComponent/>} />
        <Route path="/search" element={<SearchComponent/>} />
        <Route path="/upload" element={<UploadComponent/>} />
        <Route path="/enter_otp" element={<EnterOtpComponent/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
