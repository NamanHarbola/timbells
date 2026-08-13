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

// ===== SCROLL REVEAL ANIMATIONS (site-wide) =====
// Any element with class="reveal" fades/slides in the first time it enters
// the viewport. Runs once per element, then stops observing it.
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// ===== "OUR PAGE" INSTAGRAM REELS =====
// Each .reel-card plays its video muted + looping as a preview once it
// scrolls into view (and pauses again once it scrolls out, to save battery).
// Tapping/clicking a card opens the real reel on Instagram in a new tab.
const reelCards = document.querySelectorAll('.reel-card');
if (reelCards.length) {
  reelCards.forEach(card => {
    const video = card.querySelector('video');

    card.addEventListener('click', () => {
      const url = card.dataset.href;
      if (url) window.open(url, '_blank', 'noopener');
    });

    if (video && 'IntersectionObserver' in window) {
      const reelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.5 });
      reelObserver.observe(card);
    }
  });
}

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
