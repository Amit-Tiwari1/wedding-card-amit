// ==========================================
// 1. Envelope & Interactive Diya Lighting
// ==========================================
const openingScreen = document.getElementById('openingScreen');
const openInviteButton = document.getElementById('openInviteButton');
const envelopeOpenCard = document.getElementById('envelopeOpenCard');

function lightDiya(diyaId) {
  const diya = document.getElementById(diyaId);
  if (!diya.classList.contains('lit')) {
    diya.classList.remove('unlit');
    diya.classList.add('lit');
    diya.querySelector('.diya-text').textContent = 'शुभ मंगलम्';
    showToast('दीपक प्रज्वलित हुआ! शुभ मंगलम्।');
  }
}

function openInvitationExperience() {
  if (openingScreen.classList.contains('opening') || openingScreen.classList.contains('is-open')) return;
  
  // Dono diye auto-light up honge open karte waqt
  document.getElementById('leftDiya')?.classList.add('lit');
  document.getElementById('rightDiya')?.classList.add('lit');
  
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

// ==========================================
// 2. Audio Controller & Spinning Vinyl Player
// ==========================================
const mantraAudio = document.getElementById('ganeshMantra');
const vinylDisc = document.getElementById('vinylDisc');
const vinylStatus = document.getElementById('vinylStatus');

function updateAudioUI(isPlaying) {
  if (isPlaying) {
    vinylDisc.classList.add('spinning');
    vinylStatus.textContent = 'Playing ♫';
  } else {
    vinylDisc.classList.remove('spinning');
    vinylStatus.textContent = 'Paused';
  }
}

mantraAudio.addEventListener('play', () => updateAudioUI(true));
mantraAudio.addEventListener('pause', () => updateAudioUI(false));

async function toggleMantra(forcePlay = false) {
  if (!mantraAudio) return;
  if (!forcePlay && !mantraAudio.paused) {
    mantraAudio.pause();
    return;
  }
  try {
    await mantraAudio.play();
  } catch (err) {
    updateAudioUI(false);
  }
}

// ==========================================
// 3. Day / Night Ambience Mode
// ==========================================
function toggleAmbience() {
  const isNight = document.body.classList.toggle('night-mode');
  const btn = document.getElementById('ambienceToggle');
  btn.textContent = isNight ? '🌙' : '☀️';
  showToast(isNight ? 'रात्रि परिवेश (Night Mode) सक्रिय' : 'दिव्य प्रभात परिवेश (Day Mode) सक्रिय');
}

// ==========================================
// 4. Live Countdown Timer (Target: 02 Dec 2026)
// ==========================================
const weddingDate = new Date('2026-12-02T16:00:00+05:30').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(d).padStart(2, '0');
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 5. Double Particle Engine + Floating Cartoon Couple
// ==========================================
const canvas = document.getElementById('petalsCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

const coupleImg = new Image();
coupleImg.src = './assets/images/couple-cartoon.png';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(isGoldDust = false) {
    this.isGoldDust = isGoldDust;
    this.reset(true);
  }
  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    
    if (this.isGoldDust) {
      this.size = Math.random() * 2.5 + 1;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.7 + 0.3;
    } else {
      this.size = Math.random() * 7 + 5;
      this.speedY = Math.random() * 1.3 + 0.8;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * 360;
      this.spin = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.6 + 0.3;
    }
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (!this.isGoldDust) this.rotation += this.spin;
    if (this.y > canvas.height + 20) this.reset();
  }
  draw() {
    ctx.save();
    if (this.isGoldDust) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 218, 140, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#d9b46c';
      ctx.fill();
    } else {
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(185, 42, 60, ${this.opacity})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

class FloatingCouple {
  constructor() {
    this.reset(true);
  }
  reset(initial = false) {
    this.size = Math.random() * 25 + 65;
    this.x = Math.random() * (canvas.width - this.size - 40) + 20;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 40;
    this.speedY = Math.random() * 0.7 + 0.5;
    this.sway = Math.random() * 0.02 + 0.01;
    this.swayCount = Math.random() * Math.PI * 2;
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.3 + 0.55;
  }
  update() {
    this.y += this.speedY;
    this.swayCount += this.sway;
    this.x += Math.sin(this.swayCount) * 0.7;

    if (this.y > canvas.height * 0.75) {
      if (this.opacity < this.maxOpacity) this.opacity += 0.015;
    } else if (this.y < canvas.height * 0.35) {
      this.opacity -= 0.012;
    }

    if (this.y < -this.size || this.opacity <= 0) {
      this.reset();
    }
  }
  draw() {
    if (!coupleImg.complete || this.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.shadowBlur = 14;
    ctx.shadowColor = 'rgba(217, 180, 108, 0.45)';
    ctx.drawImage(coupleImg, this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}

const countPetals = window.innerWidth < 768 ? 16 : 28;
const countGold = window.innerWidth < 768 ? 20 : 35;

for (let i = 0; i < countPetals; i++) particles.push(new Particle(false));
for (let i = 0; i < countGold; i++) particles.push(new Particle(true));

const floatingCouples = [new FloatingCouple(), new FloatingCouple()];

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let p of particles) {
    p.update();
    p.draw();
  }

  for (let c of floatingCouples) {
    c.update();
    c.draw();
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

// Screen Tap: Phool-Varsha
window.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea')) return;
  
  for (let i = 0; i < 6; i++) {
    const burst = new Particle(Math.random() > 0.5);
    burst.x = e.clientX + (Math.random() * 40 - 20);
    burst.y = e.clientY + (Math.random() * 40 - 20);
    burst.speedY = Math.random() * 2 + 1;
    burst.speedX = Math.random() * 3 - 1.5;
    particles.push(burst);
    setTimeout(() => {
      const idx = particles.indexOf(burst);
      if (idx !== -1) particles.splice(idx, 1);
    }, 2200);
  }

  const tapCouple = new FloatingCouple();
  tapCouple.size = 55;
  tapCouple.x = e.clientX - 27;
  tapCouple.y = e.clientY - 27;
  tapCouple.opacity = 0.95;
  tapCouple.speedY = 1.6;
  floatingCouples.push(tapCouple);

  setTimeout(() => {
    const idx = floatingCouples.indexOf(tapCouple);
    if (idx !== -1) floatingCouples.splice(idx, 1);
  }, 2200);
});

// ==========================================
// 6. Interactive 3D Card Tilt
// ==========================================
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    const shine = card.querySelector('.shine-fx');
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.35), transparent 60%)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

// ==========================================
// 7. Interactive Baraat Route Animation on Scroll
// ==========================================
const baraatCar = document.getElementById('baraatCar');
const routeSection = document.getElementById('route-timeline');

window.addEventListener('scroll', () => {
  if (!routeSection || !baraatCar) return;
  const rect = routeSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top < windowHeight && rect.bottom > 0) {
    const progress = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
    baraatCar.style.left = `${progress * 85}%`;
  }
});

// ==========================================
// 8. Digital Ashirwad & WhatsApp Direct Wishes
// ==========================================
const initialWishes = [
  { name: 'पं० रवि शर्मा', msg: 'वर-वधू को वैवाहिक जीवन की अनन्त शुभकामनाएँ एवं शुभाशीर्वाद।' },
  { name: 'दीपक एवं परिवार', msg: 'अमित भाई और भाभी को शादी की बहुत बहुत बधाई!' },
  { name: 'तिवारी परिवार', msg: 'सदा सुहागन रहो, दोनों कुलों का नाम रोशन करो।' }
];

const wishesWall = document.getElementById('wishesWall');

function renderWishes() {
  if (!wishesWall) return;
  wishesWall.innerHTML = '';
  initialWishes.forEach((w) => {
    const bubble = document.createElement('div');
    bubble.className = 'wish-bubble';
    bubble.innerHTML = `<strong>${w.name}</strong><span>${w.msg}</span>`;
    wishesWall.appendChild(bubble);
  });
}
renderWishes();

function submitBlessing() {
  const name = document.getElementById('guestName').value.trim();
  const msg = document.getElementById('guestMessage').value.trim();

  if (!name || !msg) {
    showToast('कृपया अपना नाम और शुभकामना संदेश अवश्य लिखें।');
    return;
  }

  initialWishes.unshift({ name, msg });
  renderWishes();
  document.getElementById('guestName').value = '';
  document.getElementById('guestMessage').value = '';

  showToast('आपका आशीर्वाद संदेश सफलतापूर्वक जुड़ गया है। धन्यवाद!');
}

function sendWhatsAppWish() {
  const name = document.getElementById('guestName').value.trim() || 'शुभचिंतक';
  const customMsg = document.getElementById('guestMessage').value.trim();
  
  const defaultWish = `चि० अमित एवं आयु० शिवांगी को शुभ विवाह की अनन्त शुभकामनाएँ एवं हार्दिक आशीर्वाद! 💐✨\n\n— प्रेषक: ${name}`;
  const finalMsg = customMsg ? `${customMsg}\n\n— प्रेषक: ${name}` : defaultWish;
  
  const groomNumber = '919454379145';
  const waUrl = `https://api.whatsapp.com/send?phone=${groomNumber}&text=${encodeURIComponent(finalMsg)}`;
  window.open(waUrl, '_blank');
}

// ==========================================
// 9. Card Modal & Direct Downloads
// ==========================================
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

// ==========================================
// 10. Toast Notification & Web Share
// ==========================================
let toastTimer;
function showToast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

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

// ==========================================
// 11. Scroll Observers (Reveal & Stage Curtains)
// ==========================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Stage Curtains Open on Scroll
const stageSection = document.getElementById('curtain-stage');
if (stageSection) {
  const curtainObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        stageSection.classList.add('curtains-open');
      }
    });
  }, { threshold: 0.25 });
  curtainObserver.observe(stageSection);
}