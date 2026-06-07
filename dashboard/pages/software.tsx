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
      <div className="fixed inset-0 bg-cover bg-center z-0 particle-bg" />
      <Header />
      
      <main className="min-h-screen px-4 md:px-8 py-12 relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4 font-tamil">
            மென்பொருள் மற்றும் செயலிகள் (Software & Apps)
          </h1>
          <p className="text-xl text-black">
            Explore our collection of premium astrology software and tools.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map(app => (
              <div key={app.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border border-orange-200">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={app.image_url || app.image || 'https://picsum.photos/400/300?random=' + app.id} 
                    alt={app.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {app.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                      {app.badge}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-orange-600 transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-black mb-6 flex-grow line-clamp-3">
                    {app.description}
                  </p>
                  <div className="mt-auto border-t border-orange-200 pt-4">
                    <a 
                      href={app.link || '#'} 
                      className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            {apps.length === 0 && (
              <div className="col-span-full text-center text-black py-12">
                No software apps available right now. Please check back later.
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
