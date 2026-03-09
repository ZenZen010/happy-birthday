const steps = Array.from(document.querySelectorAll(".flow-step"));
const dots = Array.from(document.querySelectorAll(".dot"));
const typewriterEl = document.getElementById("typewriterText");
const launchCountdown = document.getElementById("launchCountdown");
const countdownNumber = document.getElementById("countdownNumber");

const messageText =
  "Thank you for being such an amazing person. May this year bring you joy, success, peace, and all the love you deserve.";

const stepDurationsMs = [2800, 4200, 6200, 4500];
let finaleTimer = null;

function showStep(stepNumber) {
  steps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === stepNumber - 1);
  });

  if (stepNumber === 3) {
    runTypewriter();
  }

  if (stepNumber === 5) {
    runFinaleSequence();
  }
}

function runAutoFlow() {
  showStep(1);
  let cumulativeDelay = 0;

  stepDurationsMs.forEach((duration, index) => {
    cumulativeDelay += duration;
    setTimeout(() => {
      showStep(index + 2);
    }, cumulativeDelay);
  });
}

function runTypewriter() {
  if (!typewriterEl) return;
  typewriterEl.textContent = "";
  let i = 0;

  const timer = setInterval(() => {
    typewriterEl.textContent += messageText[i];
    i += 1;
    if (i >= messageText.length) {
      clearInterval(timer);
    }
  }, 28);
}

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

function createConfettiBurst(amount = 180) {
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

function triggerConfetti(amount = 180) {
  createConfettiBurst(amount);
  if (!animating) {
    animating = true;
    drawConfetti();
  }
}

function runFinaleSequence() {
  let count = 0;

  if (finaleTimer) {
    clearInterval(finaleTimer);
  }

  finaleTimer = setInterval(() => {
    triggerConfetti();
    count += 1;
    if (count >= 5) {
      clearInterval(finaleTimer);
      finaleTimer = null;
    }
  }, 2000);
}

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
        // Some devices may still require another gesture.
      }
    }
  };

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, unlockSound, { once: true, passive: true });
  });

  tryPlay();
}

function startThreeTwoOne(onDone) {
  if (!launchCountdown || !countdownNumber) {
    onDone();
    return;
  }

  let current = 3;
  countdownNumber.textContent = String(current);

  const timer = setInterval(() => {
    current -= 1;
    if (current > 0) {
      countdownNumber.textContent = String(current);
      countdownNumber.style.animation = "none";
      void countdownNumber.offsetWidth;
      countdownNumber.style.animation = "countdownPop 0.8s ease";
      return;
    }

    clearInterval(timer);
    launchCountdown.classList.add("hidden");
    setTimeout(() => {
      launchCountdown.remove();
      onDone();
    }, 350);
  }, 1000);
}

startThreeTwoOne(runAutoFlow);


