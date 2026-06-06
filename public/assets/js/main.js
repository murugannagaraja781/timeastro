// main.js – Handles navigation burger toggle for TimeAstro

// Toggle mobile navigation menu
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle'); // optional for burger animation
  });

  // Close menu when a navigation link is clicked (mobile view)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
      }
    });
  });
}

// You can add more interactive features here (e.g., smooth scrolling, form handling).
