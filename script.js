// 1. Envelope Opening Logic
const openingScreen = document.getElementById('openingScreen');
const openInviteButton = document.getElementById('openInviteButton');
const envelopeOpenCard = document.getElementById('envelopeOpenCard');

function openInvitationExperience() {
  if (openingScreen.classList.contains('opening') || openingScreen.classList.contains('is-open')) return;
  toggleMantra(true);
  openingScreen.classList.add('opening');
  openInviteButton.disabled = true;
  openInviteButton.textContent = 'निमंत्रण खुल रहा है…';

  setTimeout(() => {
    openingScreen.classList.add('is-open');
    document.body.classList.remove('invite-locked');
  }, 1200);

  setTimeout(() => {
    openingScreen.style.display = 'none';
  }, 1900);
}

openInviteButton.addEventListener('click', openInvitationExperience);
envelopeOpenCard.addEventListener('click', openInvitationExperience);
envelopeOpenCard.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openInvitationExperience();
  }
});

// 2. Audio Controller
const mantraAudio = document.getElementById('ganeshMantra');
const mantraToggle = document.getElementById('mantraToggle');

function updateMantraToggle(isPlaying) {
  mantraToggle.setAttribute('aria-pressed', String(isPlaying));
  mantraToggle.textContent = isPlaying ? '॥' : '♫';
  mantraToggle.title = isPlaying ? 'Pause Aarti' : 'Play Aarti';
}

mantraAudio.addEventListener('play', () => updateMantraToggle(true));
mantraAudio.addEventListener('pause', () => updateMantraToggle(false));

async function toggleMantra(forcePlay = false) {
  if (!mantraAudio) return;
  if (!forcePlay && !mantraAudio.paused) {
    mantraAudio.pause();
    return;
  }
  try {
    await mantraAudio.play();
  } catch (err) {
    updateMantraToggle(false);
  }
}
mantraToggle.addEventListener('click', () => toggleMantra());

// 3. Falling Rose Petals Canvas Physics
const canvas = document.getElementById('petalsCanvas');
const ctx = canvas.getContext('2d');
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Petal {
  constructor() {
    this.reset(true);
  }
  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.size = Math.random() * 7 + 5;
    this.speedY = Math.random() * 1.3 + 0.8;
    this.speedX = Math.random() * 1.2 - 0.6;
    this.rotation = Math.random() * 360;
    this.spin = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.6 + 0.3;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.spin;
    if (this.y > canvas.height + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(185, 42, 60, ${this.opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

const petalCount = window.innerWidth < 768 ? 18 : 32;
for (let i = 0; i < petalCount; i++) {
  petals.push(new Petal());
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let petal of petals) {
    petal.update();
    petal.draw();
  }
  requestAnimationFrame(animatePetals);
}
animatePetals();

// 4. Modal & Direct HD Card Downloads
const cards = {
  gold: {
    src: './assets/images/wedding-card.png',
    name: 'Amit_Shivangi_Wedding_Invitation.png',
    caption: 'शुभ विवाह निमंत्रण पत्र (चि० अमित तिवारी संग आयु० शिवांगी तिवारी)'
  },
  celebrations: {
    src: './assets/images/preetbhoj-card.png',
    name: 'Amit_Tiwari_Bahubhoj_Card.png',
    caption: 'अखण्ड रामायण एवं बहूभोज-प्रीतिभोज पत्रिका'
  }
};

function downloadCard(which) {
  const card = cards[which];
  const a = document.createElement('a');
  a.href = card.src;
  a.download = card.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('कार्ड डाउनलोड शुरू हो गया है।');
}

function openCard(which) {
  const modal = document.getElementById('cardModal');
  document.getElementById('modalImage').src = cards[which].src;
  document.getElementById('modalCaption').textContent = cards[which].caption;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCard() {
  document.getElementById('cardModal').classList.remove('open');
  document.body.style.overflow = '';
}

function modalBackdrop(event) {
  if (event.target === document.getElementById('cardModal')) closeCard();
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCard();
});

// 5. Toast Notification
let toastTimer;
function showToast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// 6. Share Functionality
async function shareInvite() {
  const text = '॥ श्री गणेशाय नमः ॥\n\nआप सादर आमंत्रित हैं अमित संग शिवांगी के शुभ वैवाहिक समारोह में।\n\n• ०२ दिसम्बर २०२६: शुभ विवाह\n• ०४ दिसम्बर २०२६: अखण्ड रामायण पाठ\n• ०५ दिसम्बर २०२६: बहूभोज एवं प्रीतिभोज (सायं ६ बजे)\n\nस्थल: ग्राम नोखेपुर, पोस्ट बासूपुर, जिला सुल्तानपुर (उ०प्र०)\n\nकृप्या पधारकर अपना स्नेहिल आशीर्वाद प्रदान करें।';
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Amit Weds Shivangi | Wedding Invitation', text, url: window.location.href });
    } catch (e) {
      if (e.name !== 'AbortError') copyInvite(text);
    }
  } else {
    copyInvite(text);
  }
}

async function copyInvite(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('निमंत्रण संदेश कॉपी हो गया है।');
  } catch (e) {
    showToast('शेयर करने के लिए ब्राउज़र मेनू का उपयोग करें।');
  }
}

// 7. Scroll Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));