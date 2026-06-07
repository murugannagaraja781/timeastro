import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { useRouter } from 'next/router';

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState('');

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) setIsLoggedIn(true);

      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost/timeastro/api/public/courses.php', { headers });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      }
      
      // Fetch public settings for whatsapp number
      const setRes = await fetch('http://localhost/timeastro/api/public/settings.php');
      const setData = await setRes.json();
      if (setData.success && setData.data.enroll_whatsapp_number) {
        setWhatsappNumber(setData.data.enroll_whatsapp_number);
      }

    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: number, courseTitle: string) => {
    // If logged in, try to save the enrollment in the database
    if (isLoggedIn) {
      try {
        await fetch('http://localhost/timeastro/api/public/enroll.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ course_id: courseId })
        });
        fetchCourses(); // refresh to show enrolled status
      } catch (err) {
        console.error('Failed to log enrollment in DB', err);
      }
    }

    // Always redirect to WhatsApp regardless of login status
    if (whatsappNumber) {
      const msg = encodeURIComponent(`Hi, I would like to enroll in the astrology course: ${courseTitle}`);
      window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    } else {
       alert('WhatsApp number is not configured.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Head>
        <title>Courses - MyAstroLabs</title>
      </Head>

      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">Astrology Courses</h1>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Deepen your understanding of ancient Tamil astrology with our comprehensive courses taught by expert practitioners.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border border-orange-200">
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center">
                      <span className="text-white text-4xl font-serif opacity-30">MyAstroLabs</span>
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-orange-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                        {course.category}
                      </span>
                      {course.duration && (
                        <span className="text-black text-xs font-medium bg-white px-2 py-1 rounded-md">
                          {course.duration}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-black mb-3">{course.title}</h2>
                    
                    <p className="text-black mb-6 flex-grow line-clamp-4">
                      {course.description}
                    </p>
                    
                    <div className="mt-auto border-t border-orange-200 pt-4 flex items-center justify-between">
                      <div className="text-2xl font-bold text-black">
                        ₹{Number(course.price).toLocaleString('en-IN')}
                      </div>
                      
                      {course.is_enrolled ? (
                        <button disabled className="bg-orange-500 text-black px-6 py-2.5 rounded-lg font-medium cursor-not-allowed">
                          ✓ Enrolled
                        </button>
                      ) : (
                        <button onClick={() => handleEnroll(course.id, course.title)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-black text-lg">
                No courses available at the moment. Please check back later!
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
