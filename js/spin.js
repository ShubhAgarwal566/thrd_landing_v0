// -------------------------------
// THRD Slots — Front-End Prototype
// -------------------------------
const $ = selector => document.querySelector(selector);
const byId = id => document.getElementById(id);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const vibrate = pattern => navigator.vibrate && navigator.vibrate(pattern);

// Seeded Random Number Generator
function hashString(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, char; i < str.length; i++) {
    char = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ char, 2654435761);
    h2 = Math.imul(h2 ^ char, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function createRandomGenerator(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function pickWeightedOption(options, random) {
  const totalWeight = options.reduce((sum, opt) => sum + opt.w, 0);
  const randomValue = random() * totalWeight;
  let accumulatedWeight = 0;
  for (const opt of options) {
    accumulatedWeight += opt.w;
    if (randomValue <= accumulatedWeight) return opt.value;
  }
  return options[0].value;
}

// Slot Machine Symbols
const ICONS = {
  tee: `<svg class="token" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="T-shirt">
    <path fill="#00ff84" d="M10 18l12-8a16 16 0 0 0 20 0l12 8-6 9-6-4v25a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V23l-6 4-6-9z"></path>
  </svg>`,
  star: `<svg class="token" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="Star">
    <path fill="#ffd26f" d="M32 8l6.9 14 15.5 2.2-11.2 10.9 2.6 15.4L32 43.6 18.2 50.5l2.6-15.4L9.6 24.2 25.1 22 32 8z"/>
  </svg>`,
  bolt: `<svg class="token" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="Bolt">
    <path fill="#7a5cff" d="M28 6h18L34 30h12L26 58l6-20H20L28 6z"/>
  </svg>`,
  diamond: `<svg class="token" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="Diamond">
    <path fill="#56ccf2" d="M8 24l8-12h32l8 12-24 28L8 24z"/>
  </svg>`,
  seven: `<svg class="token" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="Seven">
    <path fill="#ff2fb4" d="M14 10h36l-18 44h-8l14-34H14z"/>
  </svg>`,
  smile: `<svg class="token" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="Smile">
    <circle cx="32" cy="32" r="22" fill="#4ade80"/><circle cx="24" cy="28" r="3" fill="#0c0d11"/><circle cx="40" cy="28" r="3" fill="#0c0d11"/><path d="M22 38c2 4 6 6 10 6s8-2 10-6" fill="none" stroke="#0c0d11" stroke-width="4" stroke-linecap="round"/>
  </svg>`
};

const SYMBOLS = [
  { key: 'tee', w: 8 },
  { key: 'star', w: 10 },
  { key: 'bolt', w: 10 },
  { key: 'diamond', w: 10 },
  { key: 'seven', w: 10 },
  { key: 'smile', w: 10 },
];

// Game State
const COST_PER_SPIN = 1000;
const START_CREDITS = 10000;
const START_SPINS = 10;
const GET_COUPON_ENDPOINT = 'https://hcj2v4kpg9.execute-api.ap-south-1.amazonaws.com/s1/get-coupon';
const UPDATE_COUPON_ENDPOINT = 'https://hcj2v4kpg9.execute-api.ap-south-1.amazonaws.com/s1/update-coupon';

const elements = {
  credits: byId('credits'),
  spinsPill: byId('spinsPill'),
  spinsLeftPill: byId('spinsLeftPill'),
  phone: byId('phone'),
  startBtn: byId('startBtn'),
  // changeNum: byId('changeNum'),
  // resetDemo: byId('resetDemo'),
  // showDetails: byId('showDetails'),
  login: byId('login'),
  game: byId('game'),
  phoneEcho: byId('phoneEcho'),
  spinBtn: byId('spinBtn'),
  status: byId('status'),
  message: byId('message'),
  strips: [byId('r0'), byId('r1'), byId('r2')],
  confetti: byId('confetti'),
  scratchModal: byId('scratchModal'),
  scratchCanvas: byId('scratch'),
  closeScratch: byId('closeScratch'),
  winPct: byId('winPct'),
  couponCode: byId('couponCode'),
  copyBtn: byId('copyBtn'),
  shopBtn: byId('shopBtn'),
  winLine: byId('winLine'),
  creditPill: byId('creditPill'),
  couponCard: byId('couponCard'),
  persistentCoupon: byId('persistentCoupon'),
  persistentPct: byId('persistentPct'),
  persistentCode: byId('persistentCode'),
  persistentCopyBtn: byId('persistentCopyBtn'),
  persistentShopBtn: byId('persistentShopBtn'),
};

let userData = null;
let gameRig = null;
let isSpinning = false;

// Local Storage
const STORAGE_PREFIX = 'thrdSlots_';
function loadUserData(phone) {
  const data = localStorage.getItem(STORAGE_PREFIX + phone);
  return data ? JSON.parse(data) : null;
}

function saveUserData(phone, data) {
  localStorage.setItem(STORAGE_PREFIX + phone, JSON.stringify(data));
}

// URL Overrides
function getUrlParams() {
  const params = {};
  new URLSearchParams(location.search).forEach((value, key) => params[key] = value);
  return params;
}

// Game Rig Setup (Fallback)
function setupGameRig(phone) {
  const urlParams = getUrlParams();
  const seed = hashString(phone);
  const randomGenerator = createRandomGenerator(seed);
  const prizeOptions = [
    { value: 25, w: 45 },
    { value: 30, w: 30 },
    { value: 40, w: 20 },
    { value: 50, w: 5 },
  ];
  const prize = urlParams.prize ? +urlParams.prize : pickWeightedOption(prizeOptions, randomGenerator);
  const winSpin = urlParams.win ? Math.max(7, Math.min(10, +urlParams.win)) : 7 + Math.floor(randomGenerator() * 4);
  const coupon = generateCoupon(prize);
  return { prize, winSpin, coupon };
}

function generateCoupon(discount) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `THRD${discount}-${code}`;
}

// Validate User from API
async function validateUser(phone) {
  try {
    const response = await fetch(GET_COUPON_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const apiRes = await response.json();

    // 🟢 Handle error case from API
    if (!apiRes.success) {
      const msg = apiRes.message || "Something went wrong. Please try again.";
      throw new Error(msg); // stop login flow
    }

    return true;
  } catch (error) {
    console.error('User validation error:', error);
    throw error;
  }
}

// Fetch Prize Data on Win from Update Coupon API
async function fetchPrizeOnWin(phone) {
  try {
    const response = await fetch(UPDATE_COUPON_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (!response.ok) {
      throw new Error(`Prize fetch failed: ${response.status}`);
    }
    const apiRes = await response.json();
    if (!apiRes.success || !apiRes.data) {
      throw new Error('Invalid prize response');
    }
    const { coupon, percentage } = apiRes.data;
    return { coupon, percentage: parseInt(percentage) };
  } catch (error) {
    console.error('Prize data fetch error:', error);
    // Fallback generation
    const urlParams = getUrlParams();
    const seed = hashString(phone);
    const randomGenerator = createRandomGenerator(seed);
    const prizeOptions = [
      { value: 25, w: 45 },
      { value: 30, w: 30 },
      { value: 40, w: 20 },
      { value: 50, w: 5 },
    ];
    const prize = urlParams.prize ? +urlParams.prize : pickWeightedOption(prizeOptions, randomGenerator);
    const coupon = generateCoupon(prize);
    return { coupon, percentage: prize };
  }
}

// UI Updates
function formatNumber(num) {
  return num.toLocaleString('en-IN');
}

function updateInterface() {
  elements.credits.textContent = userData ? formatNumber(userData.credits) : '—';
  const spins = userData ? userData.spins : 0;
  elements.spinsPill.textContent = `${spins}/10`;
  elements.spinsLeftPill.textContent = `Spins left: ${spins}`;
  elements.spinBtn.disabled = !userData || spins <= 0 || userData.credits < COST_PER_SPIN || userData.hasWon || isSpinning;
  
  if (userData?.hasWon) {
    elements.message.innerHTML = `<span class="win">You've already won ${userData.prize}% OFF — check your prize below.</span>`;
    showPersistentCoupon();
  }
}

function showPersistentCoupon() {
  elements.persistentCoupon.classList.remove('hide');
  elements.persistentPct.textContent = userData.prize;
  elements.persistentCode.textContent = userData.coupon;
  elements.persistentShopBtn.href = '../index.html';
}

function showGameScreen() {
  elements.login.classList.add('hide');
  elements.game.classList.remove('hide');
  elements.phoneEcho.textContent = `+91 ${userData.phone}`;
  updateInterface();
}

function showLoginScreen() {
  elements.game.classList.add('hide');
  elements.login.classList.remove('hide');
  elements.persistentCoupon.classList.add('hide');
}

// Login and Setup
elements.startBtn.addEventListener('click', async () => {
  const phone = elements.phone.value.trim();
  if (!/^\d{10}$/.test(phone)) {
    elements.status.innerHTML = `<span class="danger">Enter a valid 10-digit number.</span>`;
    vibrate(60);
    return;
  }
  let existingData = loadUserData(phone);
  if (!existingData) {
    // Show loader
    const originalText = elements.startBtn.textContent;
    elements.startBtn.disabled = true;
    elements.startBtn.textContent = 'Loading...';
    elements.status.textContent = 'Validating user...';
    try {
      await validateUser(phone);
      const urlParams = getUrlParams();
      const seed = hashString(phone);
      const randomGenerator = createRandomGenerator(seed);
      const winSpin = urlParams.win ? Math.max(7, Math.min(10, +urlParams.win)) : 7 + Math.floor(randomGenerator() * 4);
      existingData = {
        phone,
        credits: START_CREDITS,
        spins: START_SPINS,
        hasWon: false,
        prize: null,
        coupon: null,
        winSpin,
        spinCount: 0,
      };
    } catch (error) {
      alert("Invalid Number. Please apply for membership first.");
      elements.startBtn.disabled = false;
      elements.startBtn.textContent = 'Start Playing';
      elements.status.textContent = 'Enter your mobile number to begin.';
      return; // stop flow entirely
    }
    saveUserData(phone, existingData);
    
    // Reset loader
    elements.startBtn.disabled = false;
    elements.startBtn.textContent = originalText;
  }
  userData = existingData;
  gameRig = { prize: userData.prize, winSpin: userData.winSpin };
  elements.status.textContent = 'Ready.';
  elements.phoneEcho.textContent = `+91 ${userData.phone}`;
  showGameScreen();
});

// elements.changeNum.addEventListener('click', () => {
//   userData = null;
//   gameRig = null;
//   showLoginScreen();
//   elements.phone.value = '';
//   elements.status.textContent = 'Enter your mobile number to begin.';
//   updateInterface();
// });

// elements.resetDemo.addEventListener('click', (e) => {
//   e.preventDefault();
//   localStorage.clear();
//   location.reload();
// });

// elements.showDetails.addEventListener('click', (e) => {
//   e.preventDefault();
//   alert(`Rules (Prototype):
// • Login with a 10-digit mobile number to get 10,000 credits.
// • Each spin costs 1,000 credits (10 spins total).
// • One winning spin is set in the last 4 spins (7-10), showing 👕👕👕.
// • Prize is assigned via API (25%, 30%, 40%, or 50% OFF) or fallback.
// • After winning, scratch the card to reveal your coupon and tap Shop Now.
// (Real apps should validate everything on the server.)`);
// });

// Reel Animation
const CELL_HEIGHT = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slotSize')) || 96;
const SYMBOL_KEYS = SYMBOLS.map(s => s.key);

function generateReel(finalSymbol, loops = 18, reduceTee = true) {
  const reel = [];
  function pickRandomSymbol() {
    if (reduceTee) {
      const pool = [];
      SYMBOLS.forEach(({ key, w }) => {
        const weight = key === 'tee' ? 2 : w;
        for (let i = 0; i < weight; i++) pool.push(key);
      });
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
  }
  for (let i = 0; i < loops; i++) reel.push(pickRandomSymbol());
  reel.push(pickRandomSymbol(), finalSymbol, pickRandomSymbol());
  return reel.map(key => `<div class="cell">${ICONS[key]}</div>`).join('');
}

function spinReels({ isWin = false } = {}) {
  const reelDurations = [1.1, 1.3, 1.55];
  elements.message.textContent = '';
  elements.status.textContent = 'Spinning…';
  elements.spinBtn.disabled = true;
  isSpinning = true;

  const finalSymbol = isWin ? 'tee' : ['star', 'bolt', 'diamond', 'seven', 'smile'][Math.floor(Math.random() * 5)];
  
  elements.strips.forEach((strip, i) => {
    strip.classList.add('spinning');
    strip.style.transitionDuration = `${reelDurations[i]}s`;
    strip.innerHTML = generateReel(finalSymbol, 16 + Math.floor(Math.random() * 6), !isWin);
    strip.style.transform = `translateY(0px)`;
    requestAnimationFrame(() => {
      const cellCount = strip.children.length;
      const targetIndex = cellCount - 2;
      const endPosition = -(targetIndex - 2) * CELL_HEIGHT;
      strip.style.transform = `translateY(${endPosition}px)`;
    });
  });

  setTimeout(async () => {
    elements.strips.forEach(strip => strip.classList.remove('spinning'));
    isSpinning = false;
    if (isWin) {
      showConfetti();
      elements.message.innerHTML = `<span class="win">🎉 Jackpot! You unlocked ${userData.prize}% OFF.</span>`;
      vibrate([40, 30, 40, 30, 40]);
      await wait(600);
      openScratchCard();
    } else {
      elements.message.innerHTML = `<span class="lose">No luck this time — try again.</span>`;
      vibrate(30);
    }
    elements.status.textContent = 'Ready.';
    updateInterface();
  }, 1700);
}

// Confetti Animation
function showConfetti() {
  const confettiContainer = elements.confetti;
  confettiContainer.innerHTML = '';
  const pieceCount = 80;
  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('div');
    const size = 6 + Math.random() * 12;
    piece.style.position = 'absolute';
    piece.style.left = (Math.random() * 100) + '%';
    piece.style.top = '-10px';
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.background = ['#00ff84', '#7a5cff', '#ff2fb4', '#ffd26f', '#56ccf2'][i % 5];
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.opacity = '0.95';
    piece.style.transition = `transform ${1.8 + Math.random() * 1.2}s ease-out, top ${1.8 + Math.random() * 1.2}s ease-out, opacity ${1.5 + Math.random() * 0.5}s ease-out`;
    confettiContainer.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.top = '110%';
      piece.style.transform += ` translateY(${window.innerHeight * 1.1}px) rotate(${360 + Math.random() * 720}deg)`;
      piece.style.opacity = '0';
    });
  }
  confettiContainer.classList.add('on');
  setTimeout(() => {
    confettiContainer.classList.remove('on');
    confettiContainer.innerHTML = '';
  }, 3000);
}

// Spin Handler
elements.spinBtn.addEventListener('click', async () => {
  if (isSpinning || !userData) return;
  if (userData.spins <= 0 || userData.credits < COST_PER_SPIN) return;
  userData.spins -= 1;
  userData.credits -= COST_PER_SPIN;
  userData.spinCount += 1;
  saveUserData(userData.phone, userData);
  updateInterface();

  const isWinningSpin = (!userData.hasWon) && (userData.spinCount >= 6) && (userData.spinCount === userData.winSpin);
  if (isWinningSpin) {
    const prizeData = await fetchPrizeOnWin(userData.phone);
    userData.prize = prizeData.percentage;
    userData.coupon = prizeData.coupon;
    userData.hasWon = true;
    saveUserData(userData.phone, userData);
  }
  spinReels({ isWin: isWinningSpin });
});

// Coupon and Scratch Card
function openScratchCard() {
  elements.winPct.textContent = userData.prize;
  elements.couponCode.textContent = userData.coupon;
  elements.shopBtn.href = '../index.html';
  setupScratchCard();
  elements.scratchModal.classList.add('on');
}

elements.closeScratch.addEventListener('click', () => {
  elements.scratchModal.classList.remove('on');
  showPersistentCoupon();
});

// Copy button handlers
async function copyCouponCode() {
  const code = userData.coupon;
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch (_) {
    return false;
  }
}

elements.copyBtn.addEventListener('click', async () => {
  if (await copyCouponCode()) {
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = '✓ Copied!';
    setTimeout(() => elements.copyBtn.textContent = originalText, 1800);
    vibrate(20);
  } else {
    alert('Copied code: ' + userData.coupon);
  }
});

elements.persistentCopyBtn.addEventListener('click', async () => {
  if (await copyCouponCode()) {
    const originalText = elements.persistentCopyBtn.textContent;
    elements.persistentCopyBtn.textContent = '✓ Copied!';
    setTimeout(() => elements.persistentCopyBtn.textContent = 'Copy Code', 1800);
    vibrate(20);
  } else {
    alert('Copied code: ' + userData.coupon);
  }
});

// Scratch Card Canvas
let isScratched = false;
function setupScratchCard() {
  const canvas = elements.scratchCanvas;
  const card = elements.couponCard;
  const width = card.clientWidth;
  const height = card.clientHeight;
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext('2d');
  
  // Create gradient scratch surface
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#c0c6d0');
  gradient.addColorStop(1, '#a8b0bd');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add texture
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
    ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
  }
  
  ctx.globalCompositeOperation = 'destination-out';

  let isDrawing = false;
  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  }
  function scratch(e) {
    if (!isDrawing) return;
    const { x, y } = getPosition(e);
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    e.preventDefault();
  }
  function getClearedPercentage() {
    const data = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) cleared++;
    }
    return (cleared / (width * height)) * 100;
  }

  canvas.onpointerdown = e => {
    isDrawing = true;
    scratch(e);
    vibrate(10);
  };
  canvas.onpointermove = scratch;
  window.onpointerup = () => {
    isDrawing = false;
    if (!isScratched && getClearedPercentage() > 40) {
      isScratched = true;
      canvas.style.transition = 'opacity .4s ease';
      canvas.style.opacity = 0;
      setTimeout(() => canvas.style.display = 'none', 450);
      vibrate([15, 40, 15]);
    }
  };
  isScratched = false;
  canvas.style.opacity = 1;
  canvas.style.display = 'block';
}

// Initialize Game
(function initialize() {
  const lastKey = Object.keys(localStorage).find(key => key.startsWith(STORAGE_PREFIX));
  if (lastKey) {
    userData = JSON.parse(localStorage.getItem(lastKey));
    gameRig = { prize: userData.prize, winSpin: userData.winSpin };
    elements.phone.value = userData.phone || '';
    showGameScreen();
  }
  
  updateInterface();
})();