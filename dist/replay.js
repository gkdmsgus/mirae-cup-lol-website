// 예선 다시보기: 재생목록에서 고른 영상을 큰 플레이어에서 재생한다.
// JS가 없으면 모든 항목이 그냥 유튜브 링크로 동작한다.
(() => {
  const section = document.getElementById('replay');
  if (!section) return;
  const player = section.querySelector('[data-vod-player]');
  const poster = section.querySelector('[data-vod-poster]');
  const kicker = section.querySelector('[data-vod-kicker]');
  const title = section.querySelector('[data-vod-title]');
  const sub = section.querySelector('[data-vod-sub]');
  const items = [...section.querySelectorAll('[data-vod]')];
  if (!player || !poster || !items.length) return;

  function embed(id, label) {
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    frame.title = label;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    // 유튜브는 출처(Referer) 없이 열린 플레이어를 "오류 153"으로 막으므로 출처를 명시적으로 보낸다.
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(frame);
  }

  function select(item, play) {
    items.forEach(el => {
      const active = el === item;
      el.classList.toggle('is-active', active);
      if (active) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
    });
    const {vod, tag, label, desc} = item.dataset;
    kicker.textContent = tag;
    title.textContent = label;
    sub.textContent = desc;
    if (play) { embed(vod, `${label} — ${desc}`); return; }
    poster.href = item.href;
    poster.querySelector('img').src = `https://i.ytimg.com/vi/${vod}/maxresdefault.jpg`;
    poster.querySelector('.vod-tag').textContent = tag;
    player.replaceChildren(poster);
  }

  const isPlainClick = e => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  items.forEach(item => item.addEventListener('click', e => {
    if (!isPlainClick(e)) return; // 새 탭으로 열기 등은 그대로 유튜브로
    e.preventDefault();
    select(item, true);
    if (window.matchMedia('(max-width: 900px)').matches) player.scrollIntoView({behavior: 'smooth', block: 'center'});
  }));
  poster.addEventListener('click', e => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    select(items.find(el => el.classList.contains('is-active')) || items[0], true);
  });
})();
