"use client";
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Header from '../components/Header';
import ClockCard from '../components/ClockCard';
import NakshatraGrid from '../components/NakshatraGrid';
import PanchangCard from '../components/PanchangCard';
import Head from 'next/head';

export default function Home() {
  const [offers, setOffers] = useState<any[]>([]);
  const [siteTitle, setSiteTitle] = useState('MyAstroLabs');

  useEffect(() => {
    fetch('http://localhost/timeastro/api/public/offers.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOffers(data.data);
        }
      })
      .catch(console.error);

    fetch('http://localhost/timeastro/api/public/settings.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.site_title) {
          setSiteTitle(data.data.site_title);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Head>
        <title>{siteTitle} - Explore the Stars</title>
      </Head>

      <Header />

      <main className="px-4 md:px-8 py-8 relative z-10 max-w-7xl mx-auto">
        
        {/* Offers / Softer Menu Section */}
        {offers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4 font-tamil">சிறப்பு சலுகைகள் (Special Offers)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map(offer => (
                <div key={offer.id} className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-xl flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-2xl">
                  {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-full h-40 object-cover" />}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-black text-xl leading-tight pr-2">{offer.title}</h3>
                      {offer.badge && <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase animate-pulse shrink-0">{offer.badge}</span>}
                    </div>
                    <p className="text-gray-700 text-sm mb-5 flex-grow">{offer.description}</p>
                    {offer.link && (
                      <div className="mt-auto border-t border-orange-100 pt-4">
                        <a href={offer.link} className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg transition-colors">
                          Explore Now
                        </a>
                      </div>
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
    </div>
  );
}
