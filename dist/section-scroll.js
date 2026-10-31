// PC에서 마우스 휠 한 번에 한 섹션씩 이동 (styles.css의 섹션 스냅과 같은 조건에서만 동작)
(() => {
  const desktop = window.matchMedia('(min-width:901px) and (min-height:700px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selector = '.site-header, #replay, #schedule, #bracket, #lineup, #organizers, #faq, .closing, .site-footer';
  const DURATION = 600; // 한 섹션 이동 시간(ms)
  const GAP = 90;       // 휠 신호가 이만큼(ms) 끊겼다가 다시 오면 새 입력으로 봄 (트랙패드 관성은 한 번으로 묶임)
  const ease = t => 1 - Math.pow(1 - t, 3); // 빠르게 출발해 부드럽게 멈춤
  let lastWheel = 0, frame = 0, guardTimer = 0, target = null; // target: 이동 중인 목표 위치 (없으면 null)

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

  // 브라우저 기본 smooth 스크롤 대신 직접 애니메이션. 이동 중 새 입력이 오면 현재 위치에서 새 목표로 이어서 이동
  function animateTo(to) {
    const root = document.documentElement;
    cancelAnimationFrame(frame);
    clearTimeout(guardTimer);
    target = to;
    if (reduceMotion.matches) { window.scrollTo({top: to, behavior: 'instant'}); target = null; return; }
    const start = scrollY, distance = to - start, t0 = performance.now();
    root.style.scrollSnapType = 'none';
    root.style.scrollBehavior = 'auto';
    const finish = () => {
      cancelAnimationFrame(frame);
      clearTimeout(guardTimer);
      window.scrollTo(0, to);
      root.style.scrollSnapType = '';
      root.style.scrollBehavior = '';
      target = null;
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
    const list = stops();
    if (target === null) {
      // 화면보다 긴 섹션 안에서는 끝에 닿을 때까지 평소처럼 스크롤
      const y = scrollY, current = [...list].reverse().find(s => s.top <= y + 2) || list[0];
      if (current && current.bottom - current.top > innerHeight + 2) {
        if (dir > 0 && y + innerHeight < current.bottom - 2) return;
        if (dir < 0 && y > current.top + 2) return;
      }
    }
    event.preventDefault();
    const now = performance.now(), isNewInput = now - lastWheel > GAP;
    lastWheel = now;
    if (!isNewInput) return;
    // 이동 중이면 지금 향하는 목표를 기준으로 한 칸 더 (반대 방향이면 바로 되돌아감)
    const base = target ?? scrollY;
    const next = dir > 0 ? list.find(s => s.top > base + 2) : [...list].reverse().find(s => s.top < base - 2);
    if (next) animateTo(next.top);
  }, {passive: false});
})();
