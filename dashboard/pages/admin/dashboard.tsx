import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [adminUsername, setAdminUsername] = useState('');
  
  // States
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [aboutSections, setAboutSections] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);

  // Settings State
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '' });

  // Generic Form States for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'course', 'about', 'offer'
  const [editItem, setEditItem] = useState<any>(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    setAdminUsername(localStorage.getItem('adminUsername') || 'Admin');
    fetchData(activeTab);
  }, [activeTab, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    router.push('/admin');
  };

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Accept': 'application/json'
  });

  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      const ep = tab === 'settings' ? null : `http://localhost/timeastro/api/admin/${tab}.php`;
      if (ep) {
        const res = await fetch(ep, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) {
          if (tab === 'users') setUsers(data.data);
          else if (tab === 'courses') setCourses(data.data);
          else if (tab === 'about') setAboutSections(data.data);
          else if (tab === 'offers') setOffers(data.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Users ---
  const handleApproveRejectUser = async (userId: number, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const res = await fetch('http://localhost/timeastro/api/admin/users.php', {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action })
      });
      const data = await res.json();
      if (data.success) fetchData('users');
      else alert(data.message);
    } catch (err) { alert('Network error'); }
  };

  // --- Generic Delete ---
  const handleDelete = async (id: number, type: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`http://localhost/timeastro/api/admin/${type}.php?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) fetchData(type);
      else alert(data.message);
    } catch (err) { alert('Network error'); }
  };

  // --- Password Change ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/timeastro/api/admin/change_password.php', {
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm)
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) setPasswordForm({ old_password: '', new_password: '' });
    } catch (err) { alert('Network error'); }
  };

  // --- Generic Save (FormData for files) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // If edit, we need to handle PUT. PHP doesn't parse PUT multipart/form-data well, so we use POST with _method=PUT
    if (editItem && editItem.id) formData.append('id', editItem.id.toString());
    if (editItem) formData.append('_method', 'PUT');

    try {
      const res = await fetch(`http://localhost/timeastro/api/admin/${modalType}.php`, {
        method: 'POST', // We use POST for both Add and Edit because of file uploads
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchData(modalType);
      } else {
        alert(data.message);
      }
    } catch (err) { alert('Network error'); }
  };

  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Head><title>Admin Dashboard - MyAstroLabs</title></Head>

      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-xl font-bold">Super Admin</h1>
          <p className="text-sm text-indigo-300">Welcome, {adminUsername}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['users', 'courses', 'about', 'offers', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-2 rounded capitalize ${activeTab === tab ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}>
              {tab === 'about' ? 'About Page' : tab === 'offers' ? 'Offers/Softer Menu' : tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 text-black overflow-y-auto h-screen">
        {loading && <p className="text-indigo-600 mb-4 font-bold">Loading...</p>}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">User Approvals</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email / Mobile</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-gray-500">@{user.username} | {user.plan.toUpperCase()} Plan</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.email}<br/>{user.mobile}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : user.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.status === 'pending' && (
                          <div className="flex justify-center space-x-2">
                            <button onClick={() => handleApproveRejectUser(user.id, 'approve')} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded">Approve</button>
                            <button onClick={() => handleApproveRejectUser(user.id, 'reject')} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Courses</h2>
              <button onClick={() => openModal('courses')} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Add New Course</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white p-4 rounded-lg shadow">
                  {course.image_url && <img src={course.image_url} alt={course.title} className="w-full h-40 object-cover rounded mb-4" />}
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{course.category} | {course.duration} | ₹{course.price}</p>
                  <p className="text-sm text-gray-700 line-clamp-3 mb-4">{course.description}</p>
                  <div className="flex justify-between border-t pt-3">
                    <span className={`text-xs px-2 py-1 rounded ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{course.is_active ? 'Active' : 'Inactive'}</span>
                    <div className="space-x-2">
                      <button onClick={() => openModal('courses', course)} className="text-indigo-600 text-sm hover:underline">Edit</button>
                      <button onClick={() => handleDelete(course.id, 'courses')} className="text-red-600 text-sm hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Sections Tab */}
        {activeTab === 'about' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage About Page Sections</h2>
              <button onClick={() => openModal('about')} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Add Section</button>
            </div>
            <div className="space-y-4">
              {aboutSections.map(sec => (
                <div key={sec.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                  {sec.image_url && <img src={sec.image_url} alt={sec.title} className="w-32 h-32 object-cover rounded" />}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg">{sec.title} <span className="text-xs font-normal text-gray-400">({sec.section_key})</span></h3>
                      <button onClick={() => openModal('about', sec)} className="text-indigo-600 text-sm hover:underline">Edit</button>
                    </div>
                    <p className="text-gray-700 mt-2 whitespace-pre-wrap">{sec.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Offers & Softer Menu</h2>
              <button onClick={() => openModal('offers')} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Add Offer</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map(offer => (
                <div key={offer.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                  {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-24 h-24 object-cover rounded" />}
                  <div className="flex-1">
                    <h3 className="font-bold">{offer.title}</h3>
                    {offer.badge && <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">{offer.badge}</span>}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{offer.description}</p>
                    <div className="flex justify-between items-center mt-3 border-t pt-2">
                      <span className="text-xs text-blue-600 truncate max-w-[150px]">{offer.link}</span>
                      <div className="space-x-2">
                        <button onClick={() => openModal('offers', offer)} className="text-indigo-600 text-sm hover:underline">Edit</button>
                        <button onClick={() => handleDelete(offer.id, 'offers')} className="text-red-600 text-sm hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="max-w-md bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4 border-b pb-2">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Old Password</label>
                  <input type="password" required value={passwordForm.old_password} onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})} className="w-full border p-2 rounded mt-1 outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">New Password</label>
                  <input type="password" required value={passwordForm.new_password} onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} className="w-full border p-2 rounded mt-1 outline-none focus:border-indigo-500" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Update Password</button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Generic Modal for Forms */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-black">
            <h2 className="text-xl font-bold mb-4 capitalize">{editItem ? 'Edit' : 'Add'} {modalType.replace(/s$/, '')}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              
              {modalType === 'courses' && (
                <>
                  <div><label className="block text-sm">Title</label><input required name="title" defaultValue={editItem?.title} className="w-full border p-2 rounded" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm">Price (₹)</label><input type="number" step="0.01" name="price" defaultValue={editItem?.price || 0} className="w-full border p-2 rounded" /></div>
                    <div><label className="block text-sm">Category</label><input name="category" defaultValue={editItem?.category} className="w-full border p-2 rounded" /></div>
                  </div>
                  <div><label className="block text-sm">Duration</label><input name="duration" defaultValue={editItem?.duration} className="w-full border p-2 rounded" placeholder="e.g. 4 Weeks" /></div>
                  <div><label className="block text-sm">Description</label><textarea name="description" defaultValue={editItem?.description} className="w-full border p-2 rounded" rows={3}></textarea></div>
                </>
              )}

              {modalType === 'about' && (
                <>
                  <div><label className="block text-sm">Section Key (e.g. hero, team)</label><input required name="section_key" defaultValue={editItem?.section_key} className="w-full border p-2 rounded" readOnly={!!editItem} /></div>
                  <div><label className="block text-sm">Title</label><input required name="title" defaultValue={editItem?.title} className="w-full border p-2 rounded" /></div>
                  <div><label className="block text-sm">Content</label><textarea name="content" defaultValue={editItem?.content} className="w-full border p-2 rounded" rows={4}></textarea></div>
                </>
              )}

              {modalType === 'offers' && (
                <>
                  <div><label className="block text-sm">Offer Title</label><input required name="title" defaultValue={editItem?.title} className="w-full border p-2 rounded" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm">Badge (e.g. NEW, 50% OFF)</label><input name="badge" defaultValue={editItem?.badge} className="w-full border p-2 rounded" /></div>
                    <div><label className="block text-sm">Link URL</label><input name="link" defaultValue={editItem?.link} className="w-full border p-2 rounded" /></div>
                  </div>
                  <div><label className="block text-sm">Description</label><textarea name="description" defaultValue={editItem?.description} className="w-full border p-2 rounded" rows={3}></textarea></div>
                </>
              )}

              {['courses', 'about', 'offers'].includes(modalType) && (
                <div>
                  <label className="block text-sm">Image Upload (Optional)</label>
                  <input type="file" name="image" accept="image/*" className="w-full border p-2 rounded" />
                  {editItem?.image_url && <img src={editItem.image_url} alt="Current" className="h-20 mt-2 object-cover rounded" />}
                </div>
              )}

              {['courses', 'offers'].includes(modalType) && (
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="is_active" value="1" defaultChecked={editItem ? editItem.is_active === 1 : true} className="rounded text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm">Active / Show on Website</span>
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
