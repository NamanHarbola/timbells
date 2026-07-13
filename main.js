// ===== TIM BELLS — MAIN JS =====

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    if (navToggle) navToggle.textContent = '☰';
  });
});

// ===== AUTO-SYNC WHATSAPP MESSAGE WITH DISPLAYED NAME + PRICE =====
// The WhatsApp button text is built here from what's actually on the card,
// so it can never fall out of sync with the price/name shown to the customer.
// This runs on every page that has product cards + main.js.
const WA_PHONE = '919870556951';

document.querySelectorAll('.product-card').forEach(card => {
  const waLink = card.querySelector('.btn-sm--wa');
  if (!waLink) return;

  const name = card.querySelector('h3')?.textContent.trim();
  const price = card.querySelector('.price')?.textContent.trim();
  if (!name || !price) return;

  const message = `Hi Aastha! 🌸 I'd like to order the ${name} (${price}) from your Tim Bells shop.`;
  waLink.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
});
