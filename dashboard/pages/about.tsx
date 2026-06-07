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
    <>
      <Head>
        <title>About Us - MyAstroLabs</title>
      </Head>

      <div className="fixed inset-0 bg-cover bg-center z-0 particle-bg" />

      <Header />

      <main className="min-h-screen pt-12 pb-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-16 relative z-10 text-black">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 font-tamil">
            எங்களை பற்றி (About Us)
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            {sections.map((sec, index) => (
              <section key={sec.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center bg-white rounded-2xl shadow-xl border border-orange-200 p-8`}>
                {sec.image_url && (
                  <div className="w-full md:w-1/2 flex justify-center">
                    <img src={sec.image_url} alt={sec.title} className="w-full h-auto rounded-xl shadow-lg object-cover max-h-[400px] border border-orange-200" />
                  </div>
                )}
                <div className={`w-full ${sec.image_url ? 'md:w-1/2' : 'max-w-3xl mx-auto text-center'}`}>
                  <h2 className="text-3xl font-bold text-black mb-6 font-tamil">{sec.title}</h2>
                  <div className="prose prose-lg text-black whitespace-pre-wrap font-medium leading-relaxed">
                    {sec.content}
                  </div>
                </div>
              </section>
            ))}

            {sections.length === 0 && (
              <div className="text-center text-black py-12">
                Information is currently being updated.
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
