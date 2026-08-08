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
// LEAD FORM INTEGRATION CONFIGURATION (Google Forms & Web3Forms)
// ============================================================================
// To connect Google Forms:
// 1. Create a Google Form with: First Name, Last Name, Email, Phone, Interest, Message.
// 2. Set 'enabled: true' below and paste your Form Action URL + entry IDs.
// ============================================================================
const GOOGLE_FORM_CONFIG = {
  enabled: true, // Enabled for Google Forms
  formUrl: "https://docs.google.com/forms/d/1HDc812_4AIm_tf5irHyc1f8ZhkmMGcITLJWAVnUy_7k/formResponse",
  entryIds: {
    firstName: "entry.659280340",
    lastName:  "entry.846879006",
    email:     "entry.2137809758",
    phone:     "entry.816190634",
    program:   "entry.2107140761",
    interest:  "entry.2107140761",
    message:   "entry.1508656820"
  }
};

// Lead Form Submission Handler
const leadForm = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const accessKey = formData.get('access_key');

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

    try {
      if (GOOGLE_FORM_CONFIG.enabled && GOOGLE_FORM_CONFIG.formUrl.includes('docs.google.com')) {
        // --- GOOGLE FORMS SUBMISSION ---
        const params = new URLSearchParams();
        params.append(GOOGLE_FORM_CONFIG.entryIds.firstName, formData.get('First name') || '');
        params.append(GOOGLE_FORM_CONFIG.entryIds.lastName,  formData.get('Last name') || '');
        params.append(GOOGLE_FORM_CONFIG.entryIds.email,     formData.get('Email') || '');
        params.append(GOOGLE_FORM_CONFIG.entryIds.phone,     formData.get('Phone') || '');
        params.append(GOOGLE_FORM_CONFIG.entryIds.interest,  formData.get('Interest') || formData.get('Program') || '');
        params.append(GOOGLE_FORM_CONFIG.entryIds.message,   formData.get('Message') || '');

        await fetch(GOOGLE_FORM_CONFIG.formUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
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

      } else if (accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        // --- WEB3FORMS SUBMISSION ---
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          if (formStatus) {
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `
              <div class="status-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <div>
                  <strong>Thank you! Your inquiry has been sent.</strong>
                  <p>Kamal Dhaliwal will contact you directly within 24 hours.</p>
                </div>
              </div>
            `;
            formStatus.style.display = 'block';
          }
          leadForm.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }

      } else {
        throw new Error('CONFIG_REQUIRED');
      }

    } catch (err) {
      if (formStatus) {
        formStatus.className = 'form-status error';
        if (err.message === 'CONFIG_REQUIRED') {
          formStatus.innerHTML = `
            <div class="status-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <strong>Action Needed: Form Service Not Configured</strong>
                <p>Set Google Form credentials or Web3Forms key in script.js. In the meantime, <a href="mailto:kamal27d@gmail.com?subject=Website Consultation Inquiry" style="color: inherit; text-decoration: underline;">click here to email Kamal directly</a>.</p>
              </div>
            </div>
          `;
        } else {
          formStatus.innerHTML = `
            <div class="status-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <strong>Submission Error</strong>
                <p>Please call <a href="tel:+14167861194" style="color:inherit; text-decoration:underline;">+1 (416) 786-1194</a> or email <a href="mailto:kamal27d@gmail.com" style="color:inherit; text-decoration:underline;">kamal27d@gmail.com</a>.</p>
              </div>
            </div>
          `;
        }
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


