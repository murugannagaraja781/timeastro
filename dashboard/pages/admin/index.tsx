import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost/timeastro/api/auth/admin_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!data.success) {
        setError(data.message || 'Login failed');
      } else {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUsername', data.data.username);
        
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex items-center justify-center p-4">
      <Head>
        <title>Super Admin Login - MyAstroLabs</title>
      </Head>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-yellow-500"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black">Super Admin Portal</h1>
          <p className="text-sm text-black mt-2">Sign in to manage the platform</p>
        </div>

        {error && <div className="mb-4 p-3 bg-orange-500 text-black rounded text-center text-sm border border-orange-500">{error}</div>}
        {success && <div className="mb-4 p-3 bg-orange-500 text-black rounded text-center text-sm border border-orange-500">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Admin Username</label>
            <input required type="text" name="username" value={formData.username} onChange={handleChange} className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500-500 focus:border-orange-500-500 outline-none transition-all" placeholder="Enter username" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500-500 focus:border-orange-500-500 outline-none transition-all" placeholder="Enter password" />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-400 hover:to-yellow-500 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-0.5">
              SECURE LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
