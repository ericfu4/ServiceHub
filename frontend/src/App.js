// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; // you already have this
import Home from './pages/Home'; // we'll add these pages next
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ServiceDetail from './pages/ServiceDetail';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="App-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:id" element={<ServiceDetailWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<Profile />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

// Minimal wrapper so ServiceDetail gets the :id param even before you set up hooks inside it
function ServiceDetailWrapper() {
  const id = window.location.pathname.split('/').pop();
  return <ServiceDetail id={id} />;
}

export default App;
