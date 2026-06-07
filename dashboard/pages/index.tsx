"use client";
import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-darkNavy font-sans text-pureWhite">
      <Head>
        <title>{siteTitle} - Premium Astrology</title>
      </Head>

      <Header />

      <main className="px-4 md:px-8 py-10 relative z-10 max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Top Hero Section: Rotating Astrology Wheel */}
        <section className="flex justify-center w-full">
          <div className="w-full max-w-[500px]">
            <ClockCard />
          </div>
        </section>

        {/* Today's Panchangam Section */}
        <section className="w-full">
          <PanchangCard />
        </section>

        {/* Nakshatra Grid / Planetary Info */}
        <section className="w-full">
          <NakshatraGrid />
        </section>

        {/* Special Offers Section */}
        {offers.length > 0 && (
          <section className="w-full mt-6">
            <div className="flex items-center justify-between mb-6 border-b border-[rgba(212,175,55,0.2)] pb-4">
              <h2 className="font-tamil text-2xl font-bold text-gold gold-text-glow">சிறப்பு சலுகைகள்</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map(offer => (
                <div key={offer.id} className="bg-[rgba(15,23,42,0.8)] border border-[rgba(212,175,55,0.3)] premium-radius overflow-hidden premium-shadow flex flex-col h-full transition-hover hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)] group">
                  {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gold text-xl leading-tight pr-2">{offer.title}</h3>
                      {offer.badge && <span className="bg-gold text-darkNavy text-[10px] font-bold px-3 py-1 rounded-full uppercase animate-pulse shrink-0">{offer.badge}</span>}
                    </div>
                    <p className="text-gray-300 text-sm mb-6 flex-grow">{offer.description}</p>
                    {offer.link && (
                      <div className="mt-auto pt-4">
                        <a href={offer.link} className="block w-full text-center bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-darkNavy font-bold px-4 py-2.5 rounded-full transition-colors">
                          Explore Now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
