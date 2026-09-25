(() => {
  const dialog = document.getElementById('notice');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const KEY = 'lcc-notice-hidden-on';
  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  let hiddenOn = null;
  try { hiddenOn = localStorage.getItem(KEY); } catch (e) {}
  if (hiddenOn === today) return;

  function close() { dialog.close(); }
  dialog.addEventListener('close', () => document.documentElement.classList.remove('notice-open'));
  dialog.querySelectorAll('[data-notice-close]').forEach(button => button.addEventListener('click', close));
  dialog.querySelector('[data-notice-hide-today]')?.addEventListener('click', () => {
    try { localStorage.setItem(KEY, today); } catch (e) {}
    close();
  });
  // 카드 바깥(어두운 영역)을 누르면 닫기
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });

  document.documentElement.classList.add('notice-open');
  dialog.showModal();
})();
