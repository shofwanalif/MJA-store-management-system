import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Registration';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { Fragment } from 'react';

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        {/* User */}
        {/* <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
      </Route> */}
      </Routes>
    </>
  );
}
