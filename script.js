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

// ============================================================================
// LEAD FORM INTEGRATION ENDPOINT (Google Apps Script Web App)
// ============================================================================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzUjgU0B2eEJdEy9Iat-bFSUi5zpFN4q8-fisHg3yelJTe3C35wt4OJYm3pqX_KFxbq/exec";

// Lead Form Submission Handler
const leadForm = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Sending Request...';
    }

    if (formStatus) {
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';
    }

    const payload = {
      firstName: formData.get('First name') || '',
      lastName:  formData.get('Last name') || '',
      email:     formData.get('Email') || '',
      phone:     formData.get('Phone') || '',
      interest:  formData.get('Interest') || formData.get('Program') || '',
      message:   formData.get('Message') || ''
    };

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <div class="status-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <div>
              <strong>Thank you! Your inquiry has been submitted.</strong>
              <p>Kamal Dhaliwal will contact you directly within 24 hours.</p>
            </div>
          </div>
        `;
        formStatus.style.display = 'block';
      }
      leadForm.reset();

    } catch (err) {
      if (formStatus) {
        formStatus.className = 'form-status error';
        formStatus.innerHTML = `
          <div class="status-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>
              <strong>Submission Error</strong>
              <p>Please call <a href="tel:+14167861194" style="color:inherit; text-decoration:underline;">+1 (416) 786-1194</a> or email <a href="mailto:kamal27d@gmail.com" style="color:inherit; text-decoration:underline;">kamal27d@gmail.com</a>.</p>
            </div>
          </div>
        `;
        formStatus.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Send my inquiry';
      }
    }
  });
}


