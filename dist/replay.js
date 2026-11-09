// 예선 다시보기: 썸네일을 누르면 그 칸에서 바로 재생한다.
// JS가 없거나 새 탭으로 열면 그냥 유튜브 링크로 동작한다.
(() => {
  const posters = document.querySelectorAll('#replay [data-vod]');
  const isPlainClick = e => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

  posters.forEach(poster => poster.addEventListener('click', e => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(poster.dataset.vod)}?autoplay=1&rel=0`;
    frame.title = poster.dataset.label;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    // 유튜브는 출처(Referer) 없이 열린 플레이어를 "오류 153"으로 막으므로 출처를 명시적으로 보낸다.
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    poster.replaceWith(frame);
  }));
})();
