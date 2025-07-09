import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock } from 'lucide-react';
import axios from '../../api/axios';
import logo from '../../assets/MjaLogo.png';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  username: z.string().min(3, 'minimal 3 karakter'),
  password: z.string().min(6, 'minimal 6 karakter'),
});

export default function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/auth/register', data);
      toast.success('Register berhasil');
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-full max-w-sm space-y-6 text-center">
          <img src={logo} alt="Logo" className="w-28 h-28 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-gray-500">Input username and password</p>

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
              <Lock className="absolute left-3 top-3 text-gray-400" size={20}></Lock>
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
            {isSubmitting ? 'Loading...' : 'Register'}
          </button>

          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <a href="/" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
