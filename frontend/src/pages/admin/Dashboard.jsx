import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore'; // sesuaikan path dengan struktur folder kamu

export default function Dashboard() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Hello, {user?.role} 👋</h1>
      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
        Logout
      </button>
    </div>
  );
}
