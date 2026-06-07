import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    plan: 'free',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost/timeastro/api/auth/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          plan: formData.plan,
        }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setError(data.message || 'Signup failed');
      } else {
        setSuccess(data.message);
        // Clear form
        setFormData({
            firstName: '', lastName: '', username: '', email: '',
            mobile: '', password: '', confirmPassword: '', plan: 'free'
        });
      }
    } catch (err) {
      setError('An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-stretch">
      <Head>
        <title>Sign Up - MyAstroLabs Predicts</title>
      </Head>

      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        <div className="max-w-xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[orange] mb-2">MyAstroLabs Predicts</h1>
            <h2 className="text-xl text-black">Sign Up</h2>
          </div>

          {error && <div className="mb-4 p-3 bg-orange-500 text-black rounded text-center text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-orange-500 text-black rounded text-center text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Choose your plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free Plan */}
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.plan === 'free' ? 'border-[orange] bg-orange-500' : 'border-orange-200 hover:border-orange-500'}`}
                  onClick={() => setFormData({...formData, plan: 'free'})}
                >
                  <h4 className="text-[orange] font-medium">Free</h4>
                  <div className="text-sm font-bold mt-1">₹0</div>
                  <div className="text-xs text-black mt-1">Basic horoscope features</div>
                  <ul className="text-[10px] text-black mt-2 list-disc pl-3 space-y-1">
                    <li>Jadhagam</li>
                    <li>Match</li>
                    <li>Time tools</li>
                  </ul>
                </div>

                {/* Pro Plan */}
                <div className="border border-orange-200 rounded-xl p-4 opacity-60 cursor-not-allowed relative">
                  <div className="absolute top-2 right-2 bg-white text-[10px] px-2 py-0.5 rounded text-black">Coming soon</div>
                  <h4 className="text-[orange] font-medium">Pro</h4>
                  <div className="text-xs text-black mt-2">Advanced reports & tools</div>
                  <ul className="text-[10px] text-black mt-2 list-disc pl-3 space-y-1">
                    <li>Reports</li>
                    <li>Exports</li>
                    <li>Priority support</li>
                  </ul>
                </div>

                {/* Premium Plan */}
                <div className="border border-orange-200 rounded-xl p-4 opacity-60 cursor-not-allowed relative">
                  <div className="absolute top-2 right-2 bg-white text-[10px] px-2 py-0.5 rounded text-black">Coming soon</div>
                  <h4 className="text-[orange] font-medium">Premium</h4>
                  <div className="text-xs text-black mt-2">Full astrologer suite</div>
                  <ul className="text-[10px] text-black mt-2 list-disc pl-3 space-y-1">
                    <li>All Pro features</li>
                    <li>Settings</li>
                    <li>Premium charts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">First name</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-orange-200 rounded-md p-2 focus:ring-[orange] focus:border-[orange] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Last name</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-orange-200 rounded-md p-2 focus:ring-[orange] focus:border-[orange] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Username</label>
              <input required type="text" name="username" value={formData.username} onChange={handleChange} className="w-full border border-orange-200 rounded-md p-2 focus:ring-[orange] focus:border-[orange] outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Email ID</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-orange-200 rounded-md p-2 focus:ring-[orange] focus:border-[orange] outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Mobile number</label>
              <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border border-orange-200 rounded-md p-2 focus:ring-[orange] focus:border-[orange] outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-black mb-1">Password</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-orange-200 rounded-md p-2 focus:ring-[orange] focus:border-[orange] outline-none" />
                <button type="button" className="absolute right-2 top-8 text-xs text-[orange]">Show</button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-black mb-1">Confirm password</label>
                <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full border border-orange-200 rounded-md p-2 focus:ring-[orange] focus:border-[orange] outline-none" />
                <button type="button" className="absolute right-2 top-8 text-xs text-[orange]">Show</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md font-medium transition-colors">
                SIGN UP
              </button>
              <Link href="/login" className="w-full flex items-center justify-center bg-white text-[orange] border border-[orange] hover:bg-orange-500 py-2.5 rounded-md font-medium transition-colors">
                BACK TO LOGIN
              </Link>
            </div>
          </form>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-black">
          © MyAstroLabs 2026 - All rights reserved
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex w-1/2 bg-[#ffffff] items-center justify-center p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-4 shadow-xl">
          {/* We will just show a placeholder image for Ganesha if image is not there */}
          <img src="/ganesha.jpg" alt="Lord Ganesha" className="w-full h-auto rounded-xl object-contain" onError={(e) => {
             e.currentTarget.src = "https://via.placeholder.com/600x800?text=Lord+Ganesha";
          }} />
        </div>
      </div>
    </div>
  );
}
