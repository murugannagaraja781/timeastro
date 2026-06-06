import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';

export default function About() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('http://localhost/timeastro/api/public/about.php');
        const data = await res.json();
        if (data.success) {
          setSections(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch about sections', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head>
        <title>About Us - MyAstroLabs</title>
      </Head>

      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-16">
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {sections.map((sec, index) => (
              <section key={sec.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                {sec.image_url && (
                  <div className="w-full md:w-1/2">
                    <img src={sec.image_url} alt={sec.title} className="w-full h-auto rounded-2xl shadow-xl object-cover max-h-96" />
                  </div>
                )}
                <div className={`w-full ${sec.image_url ? 'md:w-1/2' : 'max-w-3xl mx-auto text-center'}`}>
                  <h2 className="text-3xl font-bold text-indigo-900 mb-6">{sec.title}</h2>
                  <div className="prose prose-indigo prose-lg text-gray-700 whitespace-pre-wrap">
                    {sec.content}
                  </div>
                </div>
              </section>
            ))}

            {sections.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                Information is currently being updated.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
