"use client";
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Header from '../components/Header';
import ClockCard from '../components/ClockCard';
import NakshatraGrid from '../components/NakshatraGrid';
import PanchangCard from '../components/PanchangCard';

export default function Home() {
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost/timeastro/api/public/offers.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOffers(data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* Background – dark galaxy image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 particle-bg"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />

      <Header />

      <main className="min-h-screen px-8 py-8 relative z-10">
        
        {/* Offers / Softer Menu Section */}
        {offers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 font-tamil">சிறப்பு சலுகைகள் (Special Offers)</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
              {offers.map(offer => (
                <div key={offer.id} className="min-w-[300px] bg-[#1a0845]/80 backdrop-blur-md border border-purple-500/30 rounded-xl overflow-hidden shadow-lg snap-start flex-shrink-0">
                  {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-full h-32 object-cover" />}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg">{offer.title}</h3>
                      {offer.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase animate-pulse">{offer.badge}</span>}
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">{offer.description}</p>
                    {offer.link && (
                      <a href={offer.link} className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                        Explore Now
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <ClockCard />
            <NakshatraGrid />
          </div>

          {/* Right column */}
          <PanchangCard />
        </div>
      </main>
    </>
  );
}
