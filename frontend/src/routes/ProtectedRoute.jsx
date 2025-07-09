// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function PrivateRoute({ allowedRoles }) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
