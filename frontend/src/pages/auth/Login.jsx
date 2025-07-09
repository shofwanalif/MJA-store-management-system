import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import logo from '../../assets/MjaLogo.png';

const schema = z.object({
  username: z.string().min(3, 'Minimal 3 karakter'),
  password: z.string().min(6, 'Minimal 6 karakter'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Login berhasil!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-full max-w-sm space-y-6 text-center">
        <img src={logo} alt="Logo" className="w-28 h-28 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">MJA Store Management System</h1>
        <p className="text-gray-500">Login to continue</p>

        <div className="space-y-4 text-left">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              {...register('username')}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded text-white font-medium bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition"
        >
          {isSubmitting ? 'Loading...' : 'Login'}
        </button>

        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
