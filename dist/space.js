(() => {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['255,255,255', '205,225,255', '168,212,255', '140,190,255', '255,226,170'];
  let width = 0, height = 0, stars = [], meteors = [], nextMeteor = 3, last = 0, frame = 0;

  function makeStar() {
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: depth * depth * 1.5 + 0.3,
      alpha: 0.35 + Math.random() * 0.65,
      speed: depth * depth * 7 + 0.8,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.6 + Math.random() * 2.2,
      color: colors[Math.random() * colors.length | 0]
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const widthChanged = window.innerWidth !== width;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // 모바일 주소창 때문에 높이만 바뀔 때는 별을 다시 만들지 않는다.
    if (widthChanged || !stars.length) stars = Array.from({length: Math.min(700, Math.round(width * height / 2600))}, makeStar);
    draw(last);
  }

  function spawnMeteor() {
    meteors.push({x: width * (0.3 + Math.random() * 0.7), y: Math.random() * height * 0.4, vx: -560, vy: 260, life: 0, ttl: 0.9 + Math.random() * 0.5});
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(time * s.twinkle + s.phase));
      if (s.r > 1.2) {
        ctx.fillStyle = `rgba(${s.color},${a * 0.18})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(${s.color},${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    for (const m of meteors) {
      const fade = Math.sin(Math.PI * m.life / m.ttl);
      const tailX = m.x - m.vx * 0.22, tailY = m.y - m.vy * 0.22;
      const trail = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      trail.addColorStop(0, `rgba(220,236,255,${0.9 * fade})`);
      trail.addColorStop(1, 'rgba(120,160,255,0)');
      ctx.strokeStyle = trail; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tailX, tailY); ctx.stroke();
    }
  }

  function step(now) {
    const time = now / 1000;
    const dt = Math.min(time - (last || time), 0.05);
    last = time;
    for (const s of stars) {
      s.x -= s.speed * dt;
      s.y -= s.speed * dt * 0.25;
      if (s.x < -4) s.x += width + 8;
      if (s.y < -4) s.y += height + 8;
    }
    nextMeteor -= dt;
    if (nextMeteor <= 0) { spawnMeteor(); nextMeteor = 4 + Math.random() * 7; }
    for (const m of meteors) { m.x += m.vx * dt; m.y += m.vy * dt; m.life += dt; }
    meteors = meteors.filter(m => m.life < m.ttl);
    draw(time);
    frame = requestAnimationFrame(step);
  }

  function start() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reduceMotion.matches || document.hidden) { meteors = []; draw(last); return; }
    last = 0;
    frame = requestAnimationFrame(step);
  }

  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener('change', start);
  resize();
  start();
})();
