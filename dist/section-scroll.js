// PC에서 마우스 휠 한 번에 한 섹션씩 이동 (styles.css의 섹션 스냅과 같은 조건에서만 동작)
(() => {
  const desktop = window.matchMedia('(min-width:901px) and (min-height:700px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selector = '.site-header, #replay, #schedule, #bracket, #lineup, #organizers, #faq, .closing, .site-footer';
  let locked = false, lastWheel = 0, fallbackTimer = 0;

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
    // 트랙패드 관성 스크롤이 끝날 때까지 기다렸다가 잠금 해제
    if (performance.now() - lastWheel < 180) { fallbackTimer = setTimeout(unlockWhenIdle, 80); return; }
    locked = false;
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
    window.scrollTo({top: next.top, behavior: reduceMotion.matches ? 'auto' : 'smooth'});
    clearTimeout(fallbackTimer);
    const done = () => { window.removeEventListener('scrollend', done); clearTimeout(fallbackTimer); unlockWhenIdle(); };
    if ('onscrollend' in window) window.addEventListener('scrollend', done);
    fallbackTimer = setTimeout(done, 1000);
  }, {passive: false});
})();
