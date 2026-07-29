const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

function searchHomes(value) {
  const query = value.trim();
  const destination = query
    ? `https://kamaldhaliwal.com/residential-properties?place=${encodeURIComponent(query)}`
    : 'https://kamaldhaliwal.com/residential-properties';
  window.location.href = destination;
}

const propertySearchForm = document.querySelector('#property-search');
if (propertySearchForm) {
  propertySearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchHomes(document.querySelector('#property-query').value);
  });
}

const quickSearchForm = document.querySelector('.quick-search');
if (quickSearchForm) {
  quickSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchHomes(event.currentTarget.querySelector('input').value);
  });
}

const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Dynamic header background on scroll past hero
const header = document.querySelector('.header');
const heroSection = document.querySelector('#hero');

if (header && heroSection) {
  const checkHeaderScroll = () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom <= 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkHeaderScroll, { passive: true });
  checkHeaderScroll();
}


