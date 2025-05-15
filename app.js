const sprayBottle = document.getElementById('spray-bottle');
const sprayAnim = document.getElementById('spray-animation');
const spraySounds = [
  document.getElementById('spray-sound-1'),
  document.getElementById('spray-sound-2'),
  document.getElementById('spray-sound-3'),
  document.getElementById('spray-sound-4')
];

let lastEventWasTouch = false;

function spray() {
  // Play a random sound
  const sound = spraySounds[Math.floor(Math.random() * spraySounds.length)];
  sound.currentTime = 0;
  sound.play();

  // Mist animation: create several particles shooting horizontally to the left, faster and further
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'mist-particle';
    // Angle for leftward spray: center at 180deg (left), spread 160deg to 200deg
    const angle = Math.PI + ((Math.random() - 0.5) * Math.PI / 6); // 160deg to 200deg
    const distance = 70 + Math.random() * 50; // px, further
    const x = Math.cos(angle) * distance; // leftward
    const y = Math.sin(angle) * distance; // slight up/down
    particle.style.setProperty('--x', `${x}px`);
    particle.style.setProperty('--y', `${y}px`);
    particle.style.animationDuration = '0.35s'; // faster
    sprayAnim.appendChild(particle);
    // Trigger animation
    setTimeout(() => particle.classList.add('active'), 10);
    // Remove after animation
    setTimeout(() => sprayAnim.removeChild(particle), 400);
  }
}

// Unlock audio on first user interaction (for iOS/Android)
function unlockAudio() {
  spraySounds.forEach(sound => {
    sound.play().catch(() => {});
    sound.pause();
    sound.currentTime = 0;
  });
  window.removeEventListener('touchstart', unlockAudio);
  window.removeEventListener('mousedown', unlockAudio);
}
window.addEventListener('touchstart', unlockAudio, { once: true });
window.addEventListener('mousedown', unlockAudio, { once: true });

sprayBottle.addEventListener('touchstart', function(e) {
  lastEventWasTouch = true;
  spray();
  e.preventDefault(); // Prevent double tap zoom
}, { passive: false });
sprayBottle.addEventListener('click', function(e) {
  if (lastEventWasTouch) {
    lastEventWasTouch = false;
    return;
  }
  spray();
});

// PWA: Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
} 