import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AuthProvider } from './context/AuthContext';
import { AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
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
          <Route path="/admin-login" element={<Login />} />
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/book" element={<BookAppointment />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/history" element={<ServiceHistory />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
