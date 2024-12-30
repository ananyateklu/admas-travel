import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Trips from './pages/Trips';
import ComfortCamp from './pages/ComfortCamp';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="trips" element={<Trips />} />
          <Route path="comfort-camp" element={<ComfortCamp />} />
          <Route path="about-us" element={<div className="pt-32">About Us Page</div>} />
          <Route path="cce-projects" element={<div className="pt-32">CCE Projects Page</div>} />
          <Route path="faq" element={<div className="pt-32">FAQ Page</div>} />
          <Route path="blog" element={<div className="pt-32">Blog Page</div>} />
          <Route path="account" element={<div className="pt-32">Account Page</div>} />
          <Route path="*" element={<div className="pt-32">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
