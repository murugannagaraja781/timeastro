import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Head from 'next/head';

export default function ContactPage() {
  const [siteTitle, setSiteTitle] = useState('MyAstroLabs');
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/timeastro/api/public/settings.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          if (data.data.site_title) setSiteTitle(data.data.site_title);
          if (data.data.contact_number) setContactNumber(data.data.contact_number);
          if (data.data.contact_email) setContactEmail(data.data.contact_email);
          if (data.data.contact_address) setContactAddress(data.data.contact_address);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Contact Us - {siteTitle}</title>
      </Head>
      <div
        className="fixed inset-0 bg-cover bg-center z-0 particle-bg"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <Header />
      
      <main className="min-h-screen px-8 py-16 relative z-10 max-w-4xl mx-auto text-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6 font-tamil drop-shadow-lg">
            எங்களை தொடர்பு கொள்ள (Contact Us)
          </h1>
          <p className="text-xl text-gray-300">
            Get in touch with {siteTitle} for astrological consultations, course inquiries, or technical support.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xl">Loading contact details...</div>
        ) : (
          <div className="bg-[#1a0845]/90 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 md:p-12 shadow-2xl space-y-12">
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-lg">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Phone Support</h3>
                <p className="text-gray-300 text-lg">Call or WhatsApp us for instant guidance.</p>
                <a href={`tel:${contactNumber}`} className="text-yellow-400 text-xl font-bold hover:underline mt-2 inline-block">
                  {contactNumber || 'Not available'}
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-lg">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Email Inquiries</h3>
                <p className="text-gray-300 text-lg">Send us a detailed message, and we'll reply within 24 hours.</p>
                <a href={`mailto:${contactEmail}`} className="text-yellow-400 text-xl font-bold hover:underline mt-2 inline-block">
                  {contactEmail || 'Not available'}
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-lg">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Our Office</h3>
                <p className="text-gray-300 text-lg whitespace-pre-wrap">
                  {contactAddress || 'Not available'}
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
    </>
  );
}
