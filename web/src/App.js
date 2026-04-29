import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import Vehicles from './pages/Vehicles';
import Offers from './pages/Offers';
import ServiceHistory from './pages/ServiceHistory';
import Feedback from './pages/Feedback';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
