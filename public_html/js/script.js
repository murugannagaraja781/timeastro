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

// Login button functionality (Placeholder)
function openLogin() {
    alert("Premium Client Portal will open here.");
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
