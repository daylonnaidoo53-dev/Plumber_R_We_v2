import { initMotion } from './motion.js';

document.body.classList.add('js-enabled');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const motion = initMotion();
const navLinks = [...document.querySelectorAll('.main-nav a')];
const header = document.querySelector('.site-header');
const dialog = document.getElementById('contact-dialog');
let contactOpener;
let contactAnimation;
let contactVersion = 0;
let navigationVersion = 0;

function setActive(id) {
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function chooseService(serviceName) {
  const serviceSelect = document.getElementById('service');
  if (!serviceSelect) return;
  const option = [...serviceSelect.options].find(item => 
    item.textContent.trim().toLowerCase() === serviceName.trim().toLowerCase() ||
    item.value.trim().toLowerCase() === serviceName.trim().toLowerCase() ||
    (serviceName.includes('Geyser') && item.textContent.includes('Geyser')) ||
    (serviceName.includes('Drain') && item.textContent.includes('Drain')) ||
    (serviceName.includes('Leak') && item.textContent.includes('Leak')) ||
    (serviceName.includes('Bathroom') && item.textContent.includes('Bathroom')) ||
    (serviceName.includes('Tap') && item.textContent.includes('Tap')) ||
    (serviceName.includes('Emergency') && item.textContent.includes('Emergency'))
  );
  if (!option) return;
  serviceSelect.value = option.value;
  serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

const serviceSelect = document.getElementById('service');
if (serviceSelect) {
  serviceSelect.addEventListener('change', () => {
    const caption = document.querySelector('.form-heading p');
    if (caption) {
      caption.textContent = serviceSelect.value
        ? `Selected: ${serviceSelect.value}. Fill in your details below.`
        : 'Provide a few details below and we’ll contact you promptly.';
    }
  });
}

const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  quoteForm.addEventListener('reset', () => {
    const caption = document.querySelector('.form-heading p');
    if (caption) caption.textContent = 'Provide a few details below and we’ll contact you promptly.';
  });
}

// Service Card Click Handler
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.target.closest('a')) return;
    const link = card.querySelector('.service-link');
    if (link) link.click();
  });
});

// Area Chips with ETA feedback
const areaEtas = {
  'Paarl Central': '📍 Paarl Central • Estimated arrival: 20–35 mins (Local dispatch)',
  'Courtrai & Paarl South': '📍 Courtrai & Paarl South • Estimated arrival: 25–40 mins',
  'Paarl North & Lemoenkloof': '📍 Paarl North & Lemoenkloof • Estimated arrival: 25–35 mins',
  'Val de Vie & Pearl Valley': '📍 Val de Vie & Pearl Valley • Estimated arrival: 30–45 mins',
  'Boschenmeer Golf Estate': '📍 Boschenmeer Golf Estate • Estimated arrival: 25–35 mins',
  'Wellington': '📍 Wellington & Surrounds • Estimated arrival: 35–50 mins',
  'Franschhoek': '📍 Franschhoek Valley • Estimated arrival: 40–55 mins',
  'Stellenbosch': '📍 Stellenbosch Outskirts • Estimated arrival: 45–60 mins',
  'Klapmuts & Simondium': '📍 Klapmuts & Simondium • Estimated arrival: 30–45 mins',
  'Windmeul & Agter-Paarl': '📍 Windmeul & Agter-Paarl • Estimated arrival: 35–45 mins'
};

document.querySelectorAll('[data-area]').forEach(button => {
  button.addEventListener('click', () => {
    const areaName = button.dataset.area;
    const suburbInput = document.getElementById('suburb');
    if (suburbInput) suburbInput.value = areaName;

    document.querySelectorAll('.areas-list li').forEach(li => li.classList.remove('active'));
    button.closest('li')?.classList.add('active');

    const etaBox = document.getElementById('area-eta-box');
    const etaPill = document.getElementById('eta-pill');
    if (etaBox && etaPill) {
      etaPill.textContent = areaEtas[areaName] || `📍 ${areaName} • Dispatching from Paarl Base`;
      etaBox.style.display = 'block';
    }

    const caption = document.querySelector('.form-heading p');
    if (caption) caption.textContent = `You're enquiring from ${areaName}. Fill in your details below.`;

    const quoteTarget = document.getElementById('quote');
    if (quoteTarget) navigate(quoteTarget);
  });
});

// Interactive Cost Estimator Data & Handler
const estimatorData = {
  geyser: {
    badge: 'Hot Water Problem',
    title: 'Geyser Repair & Replacement',
    desc: 'Faulty thermostats, burnt heating elements, leaking vacuum breakers, or urgent burst geyser replacement.',
    inclusions: [
      'Full electrical & plumbing diagnostic inspection',
      'SANS-approved heating element / thermostat replacement',
      'PIRB Certificate of Compliance (CoC) issued for replacements'
    ],
    price: 'R850 – R1,650*',
    note: '*Starting repair guide. Complete new geysers quoted inclusive of hardware & insurance signoff.',
    time: 'Expected arrival: Same-day / 1–3 hours',
    serviceOption: 'Geyser Repair & Install'
  },
  drain: {
    badge: 'Drainage & Sewer',
    title: 'Blocked Drains & Jetting',
    desc: 'Electro-mechanical clearing and high-pressure water jetting for kitchen, toilet, shower, and main sewer line blockages.',
    inclusions: [
      'Heavy-duty drain rod & rotational root cutting',
      'High-pressure hydro-jetting of fat and debris',
      'Full line flush and flow testing before signoff'
    ],
    price: 'R850 – R1,450*',
    note: '*Standard domestic unblocking. Deep root extraction or camera inspection quoted on assessment.',
    time: 'Expected arrival: Same-day / 1–2 hours',
    serviceOption: 'Blocked Drains'
  },
  leak: {
    badge: 'Non-Destructive Detection',
    title: 'Acoustic & Thermal Leak Detection',
    desc: 'Specialist acoustic listening rods, thermal imaging, and pressure decay testing to pinpoint hidden leaks under slabs and behind walls.',
    inclusions: [
      'Comprehensive moisture profiling & thermal trace',
      'Acoustic pinpointing to avoid unnecessary tile removal',
      'Detailed written report for municipality water rebate claims'
    ],
    price: 'R950 – R1,850*',
    note: '*Diagnostic fee includes equipment setup and localization. Pipe repair quoted upon pinpointing.',
    time: 'Expected arrival: Same-day / 2–4 hours',
    serviceOption: 'Leak Detection'
  },
  tap: {
    badge: 'Everyday Maintenance',
    title: 'Taps, Mixers & Toilets',
    desc: 'Repair leaking mixer cartridges, overflowing toilet valves, loose basins, and complete tapware upgrades.',
    inclusions: [
      'Ceramic disc cartridge or washer replacement',
      'Toilet inlet/flush valve calibration & seal overhaul',
      'Pressure testing and aerator cleaning'
    ],
    price: 'R550 – R1,100*',
    note: '*Minor fixes and seal replacements. Premium tapware supply quoted separately.',
    time: 'Expected arrival: Same-day / 2–4 hours',
    serviceOption: 'Toilets & Taps'
  },
  emergency: {
    badge: 'Immediate 24/7 Dispatch',
    title: 'Emergency Burst Pipes & Flooding',
    desc: 'Urgent callout for active water damage, burst municipal connections, failed stopcocks, and sudden flooding across Paarl.',
    inclusions: [
      'Emergency main water isolation & flood containment',
      'Immediate temporary or permanent pipe splice repair',
      'Assessment of damaged property & insurance assistance'
    ],
    price: 'Transparent Callout + Repair',
    note: '*After-hours transparent dispatch rates confirmed upfront. Zero surprise bill shocks.',
    time: 'Immediate dispatch: 30–45 mins in Paarl',
    serviceOption: 'Emergency Plumbing'
  }
};

let currentEstimatorJob = 'geyser';
document.querySelectorAll('.est-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const jobKey = tab.dataset.job;
    if (!estimatorData[jobKey]) return;
    currentEstimatorJob = jobKey;

    document.querySelectorAll('.est-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const data = estimatorData[jobKey];
    document.getElementById('est-badge').textContent = data.badge;
    document.getElementById('est-title').textContent = data.title;
    document.getElementById('est-desc').textContent = data.desc;
    document.getElementById('est-price').textContent = data.price;
    document.getElementById('est-note').textContent = data.note;
    document.getElementById('est-time').textContent = data.time;

    const listEl = document.getElementById('est-inclusions');
    if (listEl) {
      listEl.innerHTML = data.inclusions.map(item => `<li>${item}</li>`).join('');
    }
  });
});

const applyEstBtn = document.getElementById('est-apply-btn');
if (applyEstBtn) {
  applyEstBtn.addEventListener('click', () => {
    const data = estimatorData[currentEstimatorJob];
    if (data) {
      chooseService(data.serviceOption);
      const messageField = document.getElementById('message');
      if (messageField && !messageField.value) {
        messageField.value = `Enquiring about ${data.title} (${data.price}). Please provide an on-site assessment.`;
      }
    }
    const quoteTarget = document.getElementById('quote');
    if (quoteTarget) navigate(quoteTarget);
  });
}

// Direct "Send via WhatsApp" Button from Form
const whatsappSubmitBtn = document.getElementById('whatsapp-submit-btn');
if (whatsappSubmitBtn) {
  whatsappSubmitBtn.addEventListener('click', () => {
    const name = document.getElementById('name')?.value.trim() || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const suburb = document.getElementById('suburb')?.value.trim() || '';
    const serviceVal = document.getElementById('service')?.value || '';
    const urgencyVal = document.getElementById('urgency')?.value || '';
    const msg = document.getElementById('message')?.value.trim() || '';

    let text = `Hi Plumber R We! I would like to request plumbing assistance in Paarl & Winelands:%0A`;
    if (name) text += `• Name: ${encodeURIComponent(name)}%0A`;
    if (phone) text += `• Phone: ${encodeURIComponent(phone)}%0A`;
    if (suburb) text += `• Area/Suburb: ${encodeURIComponent(suburb)}%0A`;
    if (serviceVal) text += `• Service Needed: ${encodeURIComponent(serviceVal)}%0A`;
    if (urgencyVal) text += `• Urgency: ${encodeURIComponent(urgencyVal)}%0A`;
    if (msg) text += `• Details: ${encodeURIComponent(msg)}%0A`;

    window.open(`https://wa.me/27824865490?text=${text}`, '_blank');
  });
}

// Dialog handling
async function closeContact(restoreFocus = true) {
  const version = ++contactVersion;
  contactAnimation?.cancel();
  contactAnimation = motion.animate(dialog, [
    { opacity: 1, transform: 'translateY(0) scale(1)' },
    { opacity: 0, transform: 'translateY(12px) scale(.98)' }
  ], { duration: 180, fill: 'both' });
  if (contactAnimation) await contactAnimation.finished.catch(() => {});
  if (version !== contactVersion) return;
  dialog.close();
  contactAnimation?.cancel();
  if (restoreFocus) contactOpener?.focus({ preventScroll: true });
}

function openContact(link) {
  ++contactVersion;
  contactAnimation?.cancel();
  contactOpener = link;
  if (!dialog.open) dialog.showModal();
  contactAnimation = motion.animate(dialog, [
    { opacity: 0, transform: 'translateY(24px) scale(.96)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ], { duration: 420 });
}

if (dialog) {
  dialog.querySelectorAll('.dialog-close, .dialog-dismiss').forEach(button => 
    button.addEventListener('click', () => closeContact())
  );
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeContact(); });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      closeContact();
    }
  });
}

async function navigate(target, updateHistory = true) {
  const version = ++navigationVersion;
  if (dialog?.open) await closeContact(false);
  await motion.closeMenu();
  if (version !== navigationVersion) return;
  const destination = target.id === 'quote' ? document.getElementById('quote-form') : target;
  const focusTarget = target.id === 'quote' ? document.getElementById('name') : target.querySelector('h2') || target;
  if (!focusTarget.hasAttribute('tabindex') && focusTarget.tagName !== 'INPUT') focusTarget.tabIndex = -1;
  focusTarget.focus({ preventScroll: true });
  const top = target.id === 'main' ? 0 : destination.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height - 20;
  window.scrollTo({ top: Math.max(0, top), behavior: motion.enabled() ? 'smooth' : 'instant' });
  if (updateHistory && location.hash !== `#${target.id}`) history.pushState(null, '', `#${target.id}`);
  setActive(target.id);
}

// Global click delegation for internal navigation
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href') || '';

  // Internal hash navigation
  if (!href.startsWith('#')) return;
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();

  const serviceDataset = link.dataset.service || link.closest('.service-card')?.dataset.service;
  if (serviceDataset) {
    chooseService(serviceDataset);
  }
  navigate(target);
});

window.addEventListener('popstate', () => {
  const target = document.getElementById(location.hash.slice(1) || 'main');
  if (target) navigate(target, false);
});

// Scroll Spy
let spyFrame;
function updateActive() {
  spyFrame = 0;
  if (!header) return;
  const readingLine = header.getBoundingClientRect().bottom + 120;
  const sections = navLinks
    .map(link => document.getElementById(link.hash.slice(1)))
    .filter(Boolean);
  let nearest;
  let nearestTop = -Infinity;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= readingLine && rect.top > nearestTop) {
      nearest = section;
      nearestTop = rect.top;
    }
  });
  setActive(nearest?.id || 'main');
}

window.addEventListener('scroll', () => {
  if (!spyFrame) spyFrame = requestAnimationFrame(updateActive);
}, { passive: true });
updateActive();
