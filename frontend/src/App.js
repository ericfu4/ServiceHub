import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ServiceDetail from './pages/ServiceDetail';

function App() {
  return (
    <>
      <Header />
      <main className="App-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
