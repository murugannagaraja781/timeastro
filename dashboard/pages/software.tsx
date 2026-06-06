import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Head from 'next/head';

export default function SoftwarePage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/timeastro/api/public/offers.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) setApps(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Software & Apps - MyAstroLabs</title>
      </Head>
      <div
        className="fixed inset-0 bg-cover bg-center z-0 particle-bg"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <Header />
      
      <main className="min-h-screen px-8 py-12 relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4 font-tamil drop-shadow-lg">
            மென்பொருள் மற்றும் செயலிகள் (Software & Apps)
          </h1>
          <p className="text-xl text-gray-300">
            Explore our collection of premium astrology software and tools.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl">Loading software list...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map(app => (
              <div key={app.id} className="bg-[#1a0845]/90 backdrop-blur-md border border-purple-500/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={app.image_url || app.image || 'https://picsum.photos/400/300?random=' + app.id} 
                    alt={app.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {app.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                      {app.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {app.description}
                  </p>
                  <a 
                    href={app.link || '#'} 
                    className="block w-full text-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/50"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
            
            {apps.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12">
                No software apps available right now. Please check back later.
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
