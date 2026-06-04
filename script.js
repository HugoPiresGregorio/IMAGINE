(function () {
  "use strict";

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const clearBtn = document.getElementById("clearBtn");
  const gravityBtn = document.getElementById("gravityBtn");
  const gravLabel = document.getElementById("gravLabel");
  const intensityInput = document.getElementById("intensity");
  const specialProbInput = document.getElementById("specialProb");
  const rateInput = document.getElementById("rate");
  const maxParticlesInput = document.getElementById("maxParticles");

  function resizeCanvasToDisplaySize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }
  resizeCanvasToDisplaySize();
  window.addEventListener("resize", () => {
    resizeCanvasToDisplaySize();
  });

  const coresNormais = [
    "#e63946",
    "#457b9d",
    "#2a9d8f",
    "#f4a261",
    "#9b5de5",
    "#ffb4a2",
    "#00b4d8",
    "#a8e6cf",
    "#ffd166",
  ];
  const coresEspeciais = [
    "#FFD700",
    "#C0C0C0",
    "#00FFFF",
    "#FF00FF",
    "#39FF14",
    "#FF8C00",
    "#8A2BE2",
  ];

  const gravOptions = [
    { name: "baixo", vec: { x: 0, y: 1 } },
    { name: "cima", vec: { x: 0, y: -1 } },
    { name: "esquerda", vec: { x: -1, y: 0 } },
    { name: "direita", vec: { x: 1, y: 0 } },
  ];
  let gravIndex = 0;
  let grav = { ...gravOptions[gravIndex].vec };

  let gravityIntensity = parseFloat(intensityInput.value); // multiplicador
  let specialProb = parseFloat(specialProbInput.value);
  let spawnRate = parseInt(rateInput.value, 10);
  let MAX_PARTICLES = parseInt(maxParticlesInput.value, 10);

  function updateGravLabel() {
    gravLabel.textContent = gravOptions[gravIndex].name;
  }
  updateGravLabel();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.r = 2;
      this.color = "#000";
      this.outside = false;
      this.stopped = false;
    }
    init(x, y, color, r, vx, vy) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.r = r;
      this.vx = vx;
      this.vy = vy;
      this.outside = false;
      this.stopped = false;
    }
  }

  const pool = [];
  const particles = [];

  function acquireParticle() {
    if (pool.length) return pool.pop();
    return new Particle();
  }
  function releaseParticle(p) {
    pool.push(p);
  }

  function chooseColor() {
    if (Math.random() < specialProb) {
      return coresEspeciais[Math.floor(Math.random() * coresEspeciais.length)];
    }
    return coresNormais[Math.floor(Math.random() * coresNormais.length)];
  }

  function spawnAt(x, y, amount) {
    if (particles.length > MAX_PARTICLES) return;
    for (let i = 0; i < amount; i++) {
      if (particles.length >= MAX_PARTICLES) break;
      const p = acquireParticle();
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.8 + 0.2;
      const vx = (Math.random() - 0.5) * 1.2 + Math.cos(angle) * speed * 0.2;
      const vy = (Math.random() - 0.5) * 1.2 + Math.sin(angle) * speed * 0.2;
      const r = Math.random() * 3 + 1.5;
      p.init(x, y, chooseColor(), r, vx, vy);
      particles.push(p);
    }
  }

  let drawing = false;
  let lastPointer = null;

  function getCanvasCoords(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return { x, y };
  }

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    lastPointer = getCanvasCoords(e);
    spawnAt(lastPointer.x, lastPointer.y, spawnRate);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const pos = getCanvasCoords(e);
    const dx = pos.x - lastPointer.x;
    const dy = pos.y - lastPointer.y;
    const dist = Math.hypot(dx, dy) || 1;
    const steps = Math.min(6, Math.ceil(dist / 6));
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const ix = lastPointer.x + dx * t;
      const iy = lastPointer.y + dy * t;
      spawnAt(ix, iy, Math.max(1, Math.round(spawnRate / 3)));
    }
    lastPointer = pos;
  });

  canvas.addEventListener("pointerup", (e) => {
    drawing = false;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (e) {}
    lastPointer = null;
  });

  canvas.addEventListener("pointercancel", () => {
    drawing = false;
    lastPointer = null;
  });

  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while (particles.length) releaseParticle(particles.pop());
  });

  gravityBtn.addEventListener("click", () => {
    gravIndex = (gravIndex + 1) % gravOptions.length;
    grav = { ...gravOptions[gravIndex].vec };
    updateGravLabel();
  });

  intensityInput.addEventListener("input", (e) => {
    gravityIntensity = parseFloat(e.target.value);
  });
  specialProbInput.addEventListener("input", (e) => {
    specialProb = parseFloat(e.target.value);
  });
  rateInput.addEventListener("input", (e) => {
    spawnRate = parseInt(e.target.value, 10);
  });
  maxParticlesInput.addEventListener("input", (e) => {
    MAX_PARTICLES = parseInt(e.target.value, 10);
  });

  function drawDrop(p) {
    const gx = grav.x,
      gy = grav.y;
    const trailLen = 12 + p.r * 3;
    const tx = p.x - gx * trailLen;
    const ty = p.y - gy * trailLen;

    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.quadraticCurveTo(
      (p.x + tx) / 2 - gy * p.r,
      (p.y + ty) / 2 + gx * p.r,
      tx,
      ty,
    );
    ctx.lineTo(tx - gx * p.r * 0.8, ty - gy * p.r * 0.8);
    ctx.quadraticCurveTo(
      (p.x + tx) / 2 + gy * p.r,
      (p.y + ty) / 2 - gx * p.r,
      p.x,
      p.y,
    );
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  let lastTime = performance.now();
  function step(now) {
    const dt = Math.min(40, now - lastTime) / 1000; // limitar dt para estabilidade
    lastTime = now;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      if (!p.outside) {
        p.vx += grav.x * gravityIntensity * dt * 60 * 0.2;
        p.vy += grav.y * gravityIntensity * dt * 60 * 0.2;
      } else {
        p.vx *= 0.98; // leve arrasto
        p.vy += 0.12 * dt * 60;
      }

      p.x += p.vx;
      p.y += p.vy;

      const cssW = canvas.getBoundingClientRect().width;
      const cssH = canvas.getBoundingClientRect().height;
      if (
        !p.outside &&
        (p.x < -20 || p.x > cssW + 20 || p.y < -20 || p.y > cssH + 20)
      ) {
        p.outside = true;
      }

      if (!p.outside) {
        if (grav.x === 0 && grav.y === 1 && p.y + p.r >= cssH) {
          p.y = cssH - p.r;
          p.vx = 0;
          p.vy = 0;
          p.stopped = true;
        } else if (grav.x === 0 && grav.y === -1 && p.y - p.r <= 0) {
          p.y = p.r;
          p.vx = 0;
          p.vy = 0;
          p.stopped = true;
        } else if (grav.x === 1 && grav.y === 0 && p.x + p.r >= cssW) {
          p.x = cssW - p.r;
          p.vx = 0;
          p.vy = 0;
          p.stopped = true;
        } else if (grav.x === -1 && grav.y === 0 && p.x - p.r <= 0) {
          p.x = p.r;
          p.vx = 0;
          p.vy = 0;
          p.stopped = true;
        }
      }

      drawDrop(p);

      if (p.outside && p.y > cssH + 200) {
        particles.splice(i, 1);
        releaseParticle(p);
      }
    }

    if (particles.length > MAX_PARTICLES) {
      const excess = particles.length - MAX_PARTICLES;
      for (let k = 0; k < excess; k++) {
        const p = particles.shift();
        releaseParticle(p);
      }
    }

    requestAnimationFrame(step);
  }

  ctx.fillStyle = "#fff8e7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(step);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) lastTime = performance.now();
  });
})();
