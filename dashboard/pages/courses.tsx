import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { useRouter } from 'next/router';

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost/timeastro/api/public/enroll.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ course_id: courseId })
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        fetchCourses(); // refresh to show enrolled status
      }
    } catch (err) {
      alert('Error enrolling in course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head>
        <title>Courses - MyAstroLabs</title>
      </Head>

      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Astrology Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Deepen your understanding of ancient Tamil astrology with our comprehensive courses taught by expert practitioners.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-serif opacity-30">MyAstroLabs</span>
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {course.category}
                      </span>
                      {course.duration && (
                        <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-md">
                          {course.duration}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h2>
                    
                    <p className="text-gray-600 mb-6 flex-grow line-clamp-4">
                      {course.description}
                    </p>
                    
                    <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                      <div className="text-2xl font-bold text-indigo-700">
                        ₹{Number(course.price).toLocaleString('en-IN')}
                      </div>
                      
                      {course.is_enrolled ? (
                        <button disabled className="bg-green-100 text-green-800 px-6 py-2.5 rounded-lg font-medium cursor-not-allowed">
                          ✓ Enrolled
                        </button>
                      ) : (
                        <button onClick={() => handleEnroll(course.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                          {isLoggedIn ? 'Enroll Now' : 'Login to Enroll'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 text-lg">
                No courses available at the moment. Please check back later!
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
