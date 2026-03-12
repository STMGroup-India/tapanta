// Tapanta - Main JavaScript

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
      });
    });
  }

  // Booking page: consultation type selection
  document.querySelectorAll('.booking__option').forEach(option => {
    option.addEventListener('click', () => {
      const parent = option.closest('.booking__options');
      if (parent) {
        parent.querySelectorAll('.booking__option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
      }
    });
  });

  // Booking page: time slot selection
  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
