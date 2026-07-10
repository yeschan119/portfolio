/* Animated constellation background — adapted from the reference portfolio.
   Draws drifting cyan particles on a #1a1a2e field with a soft blue center
   bloom, connecting nearby nodes and reacting to the mouse cursor. */
(function () {
  const canvas = document.getElementById("constellation");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrameId;

  const connectionDistance = 160;
  const mouseRadius = 200;
  const pushStrength = 80;
  const ease = 0.08;
  const mouse = { x: null, y: null };

  function particleCount() {
    // Fewer nodes on small screens for performance.
    return window.innerWidth < 640 ? 60 : 120;
  }

  function initParticles(w, h) {
    particles = [];
    const count = particleCount();
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      particles.push({
        baseX: x,
        baseY: y,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles(width, height);
  }

  function animate() {
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.max(width, height) * 0.7;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grad.addColorStop(0, "rgba(2, 62, 138, 0.18)");
    grad.addColorStop(0.5, "rgba(2, 62, 138, 0.06)");
    grad.addColorStop(1, "rgba(26, 26, 46, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.baseX += p.vx;
      p.baseY += p.vy;
      if (p.baseX < 0) p.baseX = width;
      if (p.baseX > width) p.baseX = 0;
      if (p.baseY < 0) p.baseY = height;
      if (p.baseY > height) p.baseY = 0;

      let targetX = p.baseX;
      let targetY = p.baseY;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.baseX - mouse.x;
        const dy = p.baseY - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          targetX = p.baseX + (dx / (dist || 1)) * force * pushStrength;
          targetY = p.baseY + (dy / (dist || 1)) * force * pushStrength;
        }
      }

      if (Math.abs(targetX - p.x) > width / 2) p.x = targetX;
      else p.x += (targetX - p.x) * ease;
      if (Math.abs(targetY - p.y) > height / 2) p.y = targetY;
      else p.y += (targetY - p.y) * ease;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 180, 216, " + p.alpha + ")";
      ctx.fill();
    });

    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.strokeStyle = "rgba(2, 62, 138, " + alpha + ")";
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      if (mouse.x !== null && mouse.y !== null) {
        const mDist = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
        if (mDist < mouseRadius) {
          const alpha = (1 - mDist / mouseRadius) * 0.65;
          ctx.strokeStyle = "rgba(0, 180, 216, " + alpha + ")";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.lineWidth = 0.6;
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  animate();
})();
