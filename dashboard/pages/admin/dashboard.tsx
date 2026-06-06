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
  const [debugMsg, setDebugMsg] = useState('');

  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '' });
  const [autoApprove, setAutoApprove] = useState('0');
  const [enrollWhatsapp, setEnrollWhatsapp] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [siteLogoPreview, setSiteLogoPreview] = useState('');
  const [siteLogoFile, setSiteLogoFile] = useState<File | null>(null);
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');

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
    fetchSettings();
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

  const sendLog = (msg: string) => {
    fetch('http://localhost/timeastro/api/admin/log.php', {
      method: 'POST',
      body: JSON.stringify({ log: msg, time: new Date().toISOString() })
    }).catch(() => {});
  };

  const fetchData = async (tab: string) => {
    setLoading(true);
    setDebugMsg('Fetching ' + tab + '...');
    sendLog('Fetching ' + tab + '...');
    try {
      const ep = tab === 'settings' ? null : `/api/admin/${tab}.php`;
      if (ep) {
        const res = await fetch(ep, { 
          headers: getHeaders(),
          cache: 'no-store'
        });
        const data = await res.json();
        const msg = 'Fetched ' + tab + ' | Success: ' + data.success + ' | Data Length: ' + (data.data ? data.data.length : 0);
        setDebugMsg(msg);
        sendLog(msg);
        if (data.success) {
          if (tab === 'users') {
             setUsers(data.data);
             sendLog('setUsers called with ' + JSON.stringify(data.data));
          }
          else if (tab === 'courses') setCourses(data.data);
          else if (tab === 'about') setAboutSections(data.data);
          else if (tab === 'offers') setOffers(data.data);
        } else {
          setDebugMsg('Error from API: ' + data.message);
          sendLog('Error from API: ' + data.message);
        }
      }
    } catch (err: any) {
      console.error(err);
      setDebugMsg('Network/JS Error: ' + err.message);
      sendLog('Network/JS Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost/timeastro/api/admin/settings.php', { headers: getHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        setAutoApprove(data.data.auto_approve_users || '0');
        if (data.data.enroll_whatsapp_number) setEnrollWhatsapp(data.data.enroll_whatsapp_number);
        if (data.data.site_title) setSiteTitle(data.data.site_title);
        if (data.data.site_logo) setSiteLogoPreview(data.data.site_logo);
        if (data.data.contact_number) setContactNumber(data.data.contact_number);
        if (data.data.contact_email) setContactEmail(data.data.contact_email);
        if (data.data.contact_address) setContactAddress(data.data.contact_address);
      }
    } catch (err) {}
  };

  const handleToggleAutoApprove = async () => {
    const newValue = autoApprove === '1' ? '0' : '1';
    try {
      const res = await fetch('http://localhost/timeastro/api/admin/settings.php', {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto_approve_users: newValue })
      });
      const data = await res.json();
      if (data.success) {
        setAutoApprove(newValue);
      } else alert('Failed to update setting');
    } catch (err) { alert('Network error'); }
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
            <button key={tab} onClick={() => { setActiveTab(tab); fetchData(tab); }} className={`w-full text-left px-4 py-2 rounded capitalize ${activeTab === tab ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}>
              {tab === 'users' ? 'Waiting for Approval' : tab === 'about' ? 'About Page' : tab === 'offers' ? 'Offers/Softer Menu' : tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 text-black overflow-y-auto h-screen">
        {debugMsg && (
          <div className="bg-black text-green-400 p-2 mb-4 text-xs font-mono rounded shadow">
            DEBUG: {debugMsg}
          </div>
        )}
        {loading && <p className="text-indigo-600 mb-4 font-bold">Loading...</p>}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Approvals</h2>
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow border border-gray-100">
                <span className="text-sm font-medium text-gray-700">Auto Approve New Signups:</span>
                <button 
                  onClick={handleToggleAutoApprove}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoApprove === '1' ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoApprove === '1' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-xs text-gray-500 w-8">{autoApprove === '1' ? 'ON' : 'OFF'}</span>
              </div>
            </div>

            <div className="mb-8">
              {debugMsg && (
                <div className="bg-black text-green-400 p-4 mb-4 font-mono text-lg font-bold border-4 border-red-500 shadow-xl">
                  {debugMsg} <br/>
                  Total Users State Count: {users ? users.length : 0}
                </div>
              )}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-yellow-600">Waiting for Approval</h3>
                <button onClick={() => fetchData('users')} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded shadow-sm">
                  Refresh List
                </button>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 border border-yellow-200">
                {users && users.length > 0 ? (
                  users.map(user => (
                    user.status === 'pending' && (
                      <div key={user.id} className="border-b pb-4 mb-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg">{user.first_name} {user.last_name}</p>
                          <p className="text-gray-600">{user.email} | {user.mobile}</p>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending Approval</span>
                        </div>
                        <div className="space-x-2">
                          <button onClick={() => handleApproveRejectUser(user.id, 'approve')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Approve</button>
                          <button onClick={() => handleApproveRejectUser(user.id, 'reject')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Reject</button>
                        </div>
                      </div>
                    )
                  ))
                ) : (
                  <p className="text-gray-500">Loading users or no users found.</p>
                )}
                {users && users.filter(u => u.status === 'pending').length === 0 && users.length > 0 && (
                  <p className="text-gray-500">No pending approvals found.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-700">All Users (Approved/Rejected)</h3>
              <div className="bg-white shadow rounded-lg p-6">
                {users && users.map(user => (
                  user.status !== 'pending' && (
                    <div key={user.id} className="border-b pb-4 mb-4">
                      <p className="font-bold">{user.first_name} {user.last_name}</p>
                      <p className="text-gray-600">{user.email} | Status: <strong className={user.status === 'approved' ? 'text-green-600' : 'text-red-600'}>{user.status}</strong></p>
                    </div>
                  )
                ))}
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
              <div className="bg-white p-6 rounded-lg shadow">
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

            <div>
              <h2 className="text-2xl font-bold mb-4">Site Preferences</h2>
              <div className="bg-white p-6 rounded-lg shadow space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 border-b pb-2">Site Title & Logo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700">Site Title</label>
                      <input 
                        type="text" 
                        value={siteTitle} 
                        onChange={e => setSiteTitle(e.target.value)} 
                        className="w-full border p-2 rounded outline-none focus:border-indigo-500 mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Site Logo</label>
                      <div className="flex items-center gap-4">
                        {siteLogoPreview && <img src={siteLogoPreview} alt="Logo Preview" className="w-12 h-12 rounded-full object-cover border" />}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              setSiteLogoFile(e.target.files[0]);
                              setSiteLogoPreview(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          const formData = new FormData();
                          formData.append('site_title', siteTitle);
                          if (siteLogoFile) formData.append('site_logo', siteLogoFile);
                          
                          const res = await fetch('http://localhost/timeastro/api/admin/settings.php', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                            body: formData
                          });
                          const data = await res.json();
                          alert(data.message || 'Site Title & Logo Saved!');
                        } catch (err) { alert('Error saving site settings'); }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                    >
                      Save Branding
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2 border-b pb-2">Course Enrollment WhatsApp</h3>
                  <p className="text-sm text-gray-600 mb-3">When a user clicks "Enroll Now", they will be redirected to this WhatsApp number.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={enrollWhatsapp} 
                      onChange={e => setEnrollWhatsapp(e.target.value)} 
                      placeholder="e.g. 919876543210" 
                      className="flex-1 border p-2 rounded outline-none focus:border-indigo-500" 
                    />
                    <button 
                      onClick={async () => {
                        try {
                          const res = await fetch('http://localhost/timeastro/api/admin/settings.php', {
                            method: 'POST',
                            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
                            body: JSON.stringify({ enroll_whatsapp_number: enrollWhatsapp })
                          });
                          const data = await res.json();
                          alert(data.message || 'WhatsApp Number Saved!');
                        } catch (err) { alert('Error saving WhatsApp number'); }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                    >
                      Save Number
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2 border-b pb-2">Contact Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700">Contact Number</label>
                      <input 
                        type="text" 
                        value={contactNumber} 
                        onChange={e => setContactNumber(e.target.value)} 
                        className="w-full border p-2 rounded outline-none focus:border-indigo-500 mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Email Address</label>
                      <input 
                        type="email" 
                        value={contactEmail} 
                        onChange={e => setContactEmail(e.target.value)} 
                        className="w-full border p-2 rounded outline-none focus:border-indigo-500 mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Physical Address</label>
                      <textarea 
                        value={contactAddress} 
                        onChange={e => setContactAddress(e.target.value)} 
                        className="w-full border p-2 rounded outline-none focus:border-indigo-500 mt-1" 
                        rows={2}
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          const res = await fetch('http://localhost/timeastro/api/admin/settings.php', {
                            method: 'POST',
                            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              contact_number: contactNumber,
                              contact_email: contactEmail,
                              contact_address: contactAddress
                            })
                          });
                          const data = await res.json();
                          alert(data.message || 'Contact Details Saved!');
                        } catch (err) { alert('Error saving contact details'); }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                    >
                      Save Contact Details
                    </button>
                  </div>
                </div>
              </div>
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
