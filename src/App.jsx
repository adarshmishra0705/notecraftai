import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Processing from './pages/Processing';
import Study from './pages/Study';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/processing" element={<Processing />} />
        <Route path="/app/study" element={<Study />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
