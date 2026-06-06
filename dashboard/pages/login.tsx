import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost/timeastro/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!data.success) {
        setError(data.message || 'Login failed');
      } else {
        setSuccess('Login successful! Redirecting...');
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to homepage or user dashboard
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-stretch">
      <Head>
        <title>Login - MyAstroLabs Predicts</title>
      </Head>

      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-[#6d28d9] mb-3">MyAstroLabs</h1>
            <h2 className="text-xl text-gray-700">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-sm">Please enter your details to sign in.</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] outline-none" placeholder="Enter your email" />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] outline-none" placeholder="Enter your password" />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#6d28d9] focus:ring-[#6d28d9] border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#6d28d9] hover:text-[#5b21b6]">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white py-3 rounded-md font-medium transition-colors shadow-lg shadow-indigo-200">
                SIGN IN
              </button>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-gray-500 text-sm">Don't have an account? </span>
              <Link href="/signup" className="text-[#6d28d9] font-medium hover:underline text-sm">
                Sign up for free
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#2e1065] to-[#4c1d95] items-center justify-center p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8b5cf6] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#c084fc] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="z-10 text-center text-white max-w-md">
          <h2 className="text-4xl font-bold mb-6 leading-tight">Unlock Your Astrological Journey</h2>
          <p className="text-lg text-purple-200 mb-8">Access personalized horoscopes, profound predictions, and learn the ancient wisdom of Jothidam.</p>
        </div>
      </div>
    </div>
  );
}
