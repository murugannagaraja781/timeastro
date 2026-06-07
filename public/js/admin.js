// --- ADMIN DASHBOARD LOGIC --- //

document.addEventListener('DOMContentLoaded', () => {
    loadLiveDashboardData();
});

// View Switcher
function switchView(viewId) {
    // Hide all views
    document.getElementById('view-overview').style.display = 'none';
    document.getElementById('view-requests').style.display = 'none';
    document.getElementById('view-courses').style.display = 'none';
    document.getElementById('view-users').style.display = 'none';
    
    // Deactivate all menu links
    document.getElementById('menu-overview').classList.remove('active');
    document.getElementById('menu-requests').classList.remove('active');
    document.getElementById('menu-courses').classList.remove('active');
    document.getElementById('menu-users').classList.remove('active');
    
    // Show selected view
    document.getElementById(`view-${viewId}`).style.display = 'block';
    document.getElementById(`menu-${viewId}`).classList.add('active');
    
    if(viewId === 'courses') {
        renderCoursesTable();
    } else if(viewId === 'users') {
        renderUsersTable();
    } else {
        loadLiveDashboardData();
    }
}

// Load Live Data from Local Storage
function loadLiveDashboardData() {
    let requests = JSON.parse(localStorage.getItem('guru_user_requests')) || [];
    
    // Base static data simulation
    let totalUsersBase = 5248;
    let activeEnrollmentsBase = 342;
    let newEnquiriesBase = 28;
    
    // Filter requests
    const pendingRequests = requests.filter(req => req.status === 'Pending');
    const approvedRequests = requests.filter(req => req.status === 'Approved');
    
    // Calculate Live Stats
    document.getElementById('stat-total-users').innerText = (totalUsersBase + approvedRequests.length).toLocaleString();
    document.getElementById('stat-active').innerText = (activeEnrollmentsBase + approvedRequests.length).toLocaleString();
    document.getElementById('stat-enquiries').innerText = (newEnquiriesBase + pendingRequests.length).toLocaleString();
    document.getElementById('stat-pending').innerText = pendingRequests.length.toLocaleString();
    
    // Update Badge
    const badge = document.getElementById('req-badge');
    if (pendingRequests.length > 0) {
        badge.style.display = 'inline-block';
        badge.innerText = pendingRequests.length;
    } else {
        badge.style.display = 'none';
    }
    
    renderRequestsTable(pendingRequests);
    renderRecentEnrollments(approvedRequests);
}

// Render User Requests (Pending)
function renderRequestsTable(pendingRequests) {
    const tbody = document.getElementById('user-requests-body');
    tbody.innerHTML = '';
    
    if (pendingRequests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No pending requests at the moment.</td></tr>`;
        return;
    }
    
    pendingRequests.forEach(req => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
              <div class="user-cell">
                <div class="avatar">${req.name.charAt(0).toUpperCase()}</div>
                <span style="color: #fff; font-weight: 500;">${req.name}</span>
              </div>
            </td>
            <td>${req.email}</td>
            <td>${req.phone}</td>
            <td>${req.date}</td>
            <td style="display: flex; gap: 10px;">
                <button onclick="handleRequest(${req.id}, 'approve')" style="background: rgba(46,204,113,0.2); color: #2ecc71; border: 1px solid #2ecc71; padding: 6px 12px; border-radius: 5px; cursor: pointer; transition: all 0.3s;">Approve</button>
                <button onclick="handleRequest(${req.id}, 'reject')" style="background: rgba(231,76,60,0.2); color: #e74c3c; border: 1px solid #e74c3c; padding: 6px 12px; border-radius: 5px; cursor: pointer; transition: all 0.3s;">Reject</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Recent Enrollments (Approved)
function renderRecentEnrollments(approvedRequests) {
    const tbody = document.getElementById('recent-enrollments-body');
    tbody.innerHTML = '';
    
    // Static base data for visuals
    let enrollmentsHTML = `
      <tr>
        <td>
          <div class="user-cell">
            <div class="avatar">R</div>
            <span>Ramesh Kumar</span>
          </div>
        </td>
        <td>Saptharishi Nadi</td>
        <td>Oct 24, 2026</td>
        <td><span class="status-badge active">Active</span></td>
        <td><button class="btn-action">Manage</button></td>
      </tr>
      <tr>
        <td>
          <div class="user-cell">
            <div class="avatar">S</div>
            <span>Sita Lakshmi</span>
          </div>
        </td>
        <td>Advanced Astrology</td>
        <td>Oct 23, 2026</td>
        <td><span class="status-badge pending">Pending</span></td>
        <td><button class="btn-action">Manage</button></td>
      </tr>
    `;
    
    // Add live approved users to top of table
    approvedRequests.reverse().forEach(req => {
        enrollmentsHTML = `
        <tr>
          <td>
            <div class="user-cell">
              <div class="avatar">${req.name.charAt(0).toUpperCase()}</div>
              <span>${req.name}</span>
            </div>
          </td>
          <td>Website Enrollment</td>
          <td>${req.date}</td>
          <td><span class="status-badge active" style="box-shadow: 0 0 10px rgba(46,204,113,0.5);">New Active</span></td>
          <td><button class="btn-action">Manage</button></td>
        </tr>
        ` + enrollmentsHTML;
    });
    
    tbody.innerHTML = enrollmentsHTML;
}

// Handle Approve / Reject Actions
function handleRequest(id, action) {
    let requests = JSON.parse(localStorage.getItem('guru_user_requests')) || [];
    
    // Find the request
    const index = requests.findIndex(req => req.id === id);
    if (index !== -1) {
        if (action === 'approve') {
            requests[index].status = 'Approved';
            alert(`✅ ${requests[index].name}'s request has been APPROVED! They are now an active user.`);
        } else if (action === 'reject') {
            const confirmReject = confirm(`Are you sure you want to completely reject and delete ${requests[index].name}'s request?`);
            if (!confirmReject) return;
            
            // Delete the request
            requests.splice(index, 1);
            alert(`❌ The request has been rejected and deleted.`);
        }
        
        // Save and reload UI
        localStorage.setItem('guru_user_requests', JSON.stringify(requests));
        loadLiveDashboardData();
    }
}

// --- COURSE MANAGEMENT LOGIC --- //

function getCourses() {
    let courses = JSON.parse(localStorage.getItem('guru_courses'));
    if (!courses || courses.length === 0) {
        if (typeof websiteData !== 'undefined' && websiteData.courses) {
            courses = websiteData.courses;
            localStorage.setItem('guru_courses', JSON.stringify(courses));
        } else {
            courses = [];
        }
    }
    return courses;
}

function renderCoursesTable() {
    const courses = getCourses();
    const tbody = document.getElementById('courses-body');
    tbody.innerHTML = '';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong style="color: #fff;">${course.title}</strong></td>
            <td style="color: var(--gold);">${course.price}</td>
            <td>${course.duration}</td>
            <td style="display: flex; gap: 10px;">
                <button onclick="editCourse('${course.id}')" style="background: rgba(52,152,219,0.2); color: #3498db; border: 1px solid #3498db; padding: 6px 12px; border-radius: 5px; cursor: pointer; transition: all 0.3s;">Edit</button>
                <button onclick="deleteCourse('${course.id}')" style="background: rgba(231,76,60,0.2); color: #e74c3c; border: 1px solid #e74c3c; padding: 6px 12px; border-radius: 5px; cursor: pointer; transition: all 0.3s;">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openCourseModal() {
    document.getElementById('course-modal').style.display = 'flex';
    document.getElementById('course-modal-title').innerText = 'Add New Course';
    document.getElementById('course-id').value = '';
    document.getElementById('course-title').value = '';
    document.getElementById('course-desc').value = '';
    document.getElementById('course-duration').value = '';
    document.getElementById('course-price').value = '';
}

function closeCourseModal() {
    document.getElementById('course-modal').style.display = 'none';
}

function editCourse(id) {
    const courses = getCourses();
    const course = courses.find(c => c.id === id);
    if(course) {
        document.getElementById('course-modal').style.display = 'flex';
        document.getElementById('course-modal-title').innerText = 'Edit Course';
        document.getElementById('course-id').value = course.id;
        document.getElementById('course-title').value = course.title;
        document.getElementById('course-desc').value = course.description;
        document.getElementById('course-duration').value = course.duration;
        document.getElementById('course-price').value = course.price;
    }
}

function saveCourse(event) {
    event.preventDefault();
    let courses = getCourses();
    
    const id = document.getElementById('course-id').value;
    const title = document.getElementById('course-title').value;
    const desc = document.getElementById('course-desc').value;
    const duration = document.getElementById('course-duration').value;
    const price = document.getElementById('course-price').value;
    
    if(id) {
        // Update existing
        const index = courses.findIndex(c => c.id === id);
        if(index !== -1) {
            courses[index].title = title;
            courses[index].description = desc;
            courses[index].duration = duration;
            courses[index].price = price;
        }
    } else {
        // Add new
        courses.push({
            id: 'c' + Date.now(),
            image: 'images/nadi.png', // Default image
            title: title,
            description: desc,
            duration: duration,
            price: price
        });
    }
    
    localStorage.setItem('guru_courses', JSON.stringify(courses));
    closeCourseModal();
    renderCoursesTable();
    alert('Course saved successfully! Changes will reflect on the main website.');
}

function deleteCourse(id) {
    if(confirm('Are you sure you want to delete this course?')) {
        let courses = getCourses();
        courses = courses.filter(c => c.id !== id);
        localStorage.setItem('guru_courses', JSON.stringify(courses));
        renderCoursesTable();
    }
}

function renderUsersTable() {
    let requests = JSON.parse(localStorage.getItem('guru_user_requests')) || [];
    const tbody = document.getElementById('users-body');
    tbody.innerHTML = '';
    
    if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No users registered yet.</td></tr>`;
        return;
    }
    
    requests.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
              <div class="user-cell">
                <div class="avatar">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                <span style="color: #fff; font-weight: 500;">${user.name || 'Anonymous'}</span>
              </div>
            </td>
            <td>${user.email || '-'}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.date || '-'}</td>
            <td>
              <span class="status-badge ${user.status === 'Approved' ? 'active' : 'pending'}" style="${user.status === 'Approved' ? 'box-shadow: 0 0 10px rgba(46,204,113,0.3);' : ''}">
                ${user.status}
              </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}
