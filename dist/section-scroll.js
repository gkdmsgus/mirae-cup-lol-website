// PC에서 마우스 휠 한 번에 한 섹션씩 이동 (styles.css의 섹션 스냅과 같은 조건에서만 동작)
(() => {
  const desktop = window.matchMedia('(min-width:901px) and (min-height:700px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selector = '.site-header, #replay, #schedule, #bracket, #lineup, #organizers, #faq, .closing, .site-footer';
  const DURATION = 420; // 한 섹션 이동 시간(ms) — 작을수록 빠름
  const IDLE = 110;     // 트랙패드 관성이 끝났다고 보는 휠 공백(ms)
  const ease = t => 1 - Math.pow(1 - t, 3); // 빠르게 출발해 부드럽게 멈춤
  let locked = false, lastWheel = 0, idleTimer = 0, guardTimer = 0, frame = 0;

  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  // 각 섹션이 화면에 맞춰지는 스크롤 위치 (푸터는 화면 아래쪽 기준)
  function stops() {
    const list = [...document.querySelectorAll(selector)].filter(el => el.getClientRects().length).map(el => {
      const r = el.getBoundingClientRect();
      const top = el.matches('.site-footer') ? scrollY + r.bottom - innerHeight : scrollY + r.top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
      return {top: Math.max(0, Math.min(Math.round(top), maxScroll())), bottom: Math.round(scrollY + r.bottom)};
    });
    return list.sort((a, b) => a.top - b.top);
  }

  function unlockWhenIdle() {
    // 트랙패드 관성 휠이 멈출 때까지 기다렸다가 잠금 해제 (마우스는 바로 풀림)
    const wait = IDLE - (performance.now() - lastWheel);
    if (wait > 0) { idleTimer = setTimeout(unlockWhenIdle, wait); return; }
    locked = false;
  }

  // 브라우저 기본 smooth 스크롤 대신 직접 애니메이션 (스냅은 이동 중에만 잠시 끔)
  function animateTo(target) {
    const root = document.documentElement;
    if (reduceMotion.matches) { window.scrollTo({top: target, behavior: 'instant'}); unlockWhenIdle(); return; }
    const start = scrollY, distance = target - start, t0 = performance.now();
    let finished = false;
    root.style.scrollSnapType = 'none';
    root.style.scrollBehavior = 'auto';
    cancelAnimationFrame(frame);
    clearTimeout(guardTimer);
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      clearTimeout(guardTimer);
      window.scrollTo(0, target);
      root.style.scrollSnapType = '';
      root.style.scrollBehavior = '';
      unlockWhenIdle();
    };
    const step = now => {
      const p = Math.min(1, (now - t0) / DURATION);
      if (p >= 1) { finish(); return; }
      window.scrollTo(0, start + distance * ease(p));
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    // 탭이 가려져 애니메이션 프레임이 멈춰도 이동이 반쯤 걸린 채 남지 않도록
    guardTimer = setTimeout(finish, DURATION + 200);
  }

  window.addEventListener('wheel', event => {
    if (!desktop.matches || event.ctrlKey || document.documentElement.classList.contains('notice-open')) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const dir = Math.sign(event.deltaY);
    const y = scrollY, list = stops();
    const current = [...list].reverse().find(s => s.top <= y + 2) || list[0];
    // 화면보다 긴 섹션 안에서는 끝에 닿을 때까지 평소처럼 스크롤
    if (current && current.bottom - current.top > innerHeight + 2) {
      if (dir > 0 && y + innerHeight < current.bottom - 2) return;
      if (dir < 0 && y > current.top + 2) return;
    }
    event.preventDefault();
    lastWheel = performance.now();
    if (locked) return;
    const next = dir > 0 ? list.find(s => s.top > y + 2) : [...list].reverse().find(s => s.top < y - 2);
    if (!next) return;
    locked = true;
    clearTimeout(idleTimer);
    animateTo(next.top);
  }, {passive: false});
})();
