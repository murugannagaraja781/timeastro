// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update active state
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navHeight = document.getElementById('navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - navHeight - 100)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Navbar background transparency on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(253, 251, 247, 0.98)';
        navbar.style.boxShadow = '0 10px 30px rgba(211, 84, 0, 0.05)';
        navbar.style.padding = '0 6%';
        navbar.style.height = '80px';
    } else {
        navbar.style.background = 'rgba(253, 251, 247, 0.85)';
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '0 6%';
        navbar.style.height = '90px'; // Original CSS var
    }
});

// Auth Modal Logic
function openLogin() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'flex';
        switchAuthTab('login'); // Always open on login tab
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchAuthTab(tab) {
    // Update Tab Buttons
    document.querySelectorAll('.auth-tab').forEach(btn => btn.classList.remove('active'));
    // Update Forms
    document.querySelectorAll('.auth-form').forEach(form => form.style.display = 'none');
    
    if (tab === 'login') {
        document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
        document.getElementById('login-form').style.display = 'block';
    } else {
        document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
        document.getElementById('signup-form').style.display = 'block';
    }
}

// Super Admin Login Logic
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email === 'admin@gmail.com' && password === 'admin123') {
        // Successful login
        window.location.href = 'admin.html';
    } else {
        // Failed login
        alert('Incorrect Email or Password! Please try again.');
    }
}

// Handle User Signup Registration
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-mobile').value;
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Get existing requests or create new array
    let requests = JSON.parse(localStorage.getItem('guru_user_requests')) || [];
    
    // Add new request
    requests.push({
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        date: date,
        status: 'Pending'
    });
    
    // Save back to storage
    localStorage.setItem('guru_user_requests', JSON.stringify(requests));
    
    alert('Registration Successful! Your request has been sent for Admin Approval. Please check back later.');
    
    // Clear form and switch to login
    event.target.reset();
    switchAuthTab('login');
}

// 3D Parallax effect on Jyotish Chart based on mouse movement
const chakraWrapper = document.querySelector('.chakra-wrapper');
if (chakraWrapper) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        // Base rotation is rotateX(15deg) rotateY(-15deg)
        chakraWrapper.style.transform = `rotateX(${15 + yAxis}deg) rotateY(${-15 + xAxis}deg)`;
    });
}
