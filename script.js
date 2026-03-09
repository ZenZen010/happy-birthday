const modal = document.getElementById("secretModal");
const messageBtn = document.getElementById("messageBtn");
const closeModal = document.getElementById("closeModal");

messageBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

const confettiBtn = document.getElementById("confettiBtn");
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confetti = [];
let animating = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createConfettiBurst(amount = 160) {
  const colors = ["#ff4fa0", "#ff87c5", "#ffd1e7", "#ffffff", "#d63384"];
  for (let i = 0; i < amount; i += 1) {
    confetti.push({
      x: canvas.width * 0.5,
      y: canvas.height * 0.3,
      r: Math.random() * 4 + 2,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * Math.PI * 2,
      s: Math.random() * 7 + 2,
      v: Math.random() * 2 + 1,
      life: Math.random() * 70 + 60
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p) => {
    p.x += Math.cos(p.a) * p.s;
    p.y += Math.sin(p.a) * p.s + p.v;
    p.life -= 1;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  confetti = confetti.filter((p) => p.life > 0);

  if (confetti.length > 0) {
    requestAnimationFrame(drawConfetti);
  } else {
    animating = false;
  }
}

function triggerConfetti(amount = 160) {
  createConfettiBurst(amount);
  if (!animating) {
    animating = true;
    drawConfetti();
  }
}

confettiBtn.addEventListener("click", () => {
  triggerConfetti();
});

let autoConfettiCount = 0;
const autoConfettiTimer = setInterval(() => {
  triggerConfetti();
  autoConfettiCount += 1;
  if (autoConfettiCount >= 5) {
    clearInterval(autoConfettiTimer);
  }
}, 2000);

const cards = document.querySelectorAll(".card");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.18 }
);

cards.forEach((card, i) => {
  card.style.transitionDelay = `${Math.min(i * 90, 300)}ms`;
  revealObserver.observe(card);
});

const floatingHearts = document.querySelector(".floating-hearts");
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  floatingHearts.style.transform = `translate(${x}px, ${y}px)`;
});

const bgMusic = document.getElementById("bgMusic");

if (bgMusic) {
  bgMusic.volume = 0.5;
  bgMusic.loop = true;
  bgMusic.muted = true;

  const tryPlay = async () => {
    try {
      await bgMusic.play();
    } catch {
      // Browser blocked autoplay; first interaction will retry.
    }
  };

  const unlockSound = async () => {
    bgMusic.muted = false;
    if (bgMusic.paused) {
      try {
        await bgMusic.play();
      } catch {
        // Ignore; some devices may still require another gesture.
      }
    }
  };

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, unlockSound, { once: true, passive: true });
  });

  tryPlay();
  bgMusic.addEventListener("ended", async () => {
    bgMusic.currentTime = 0;
    try {
      await bgMusic.play();
    } catch {
      // If replay is blocked, next user interaction will resume it.
    }
  });
}









