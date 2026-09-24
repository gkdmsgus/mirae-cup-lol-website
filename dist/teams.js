// 참가 팀·선수 정보 — 확정되면 이 목록만 수정하세요.
// 비워 둔 값('')은 "추후 공개"로 표시됩니다.
// photo: 사진 파일 경로 (예: 'assets/players/el1-top.jpg'), 정사각형 600px 이상 권장.
const TEAMS = [
  {club: 'EL', name: 'EL TEAM 1', players: [
    {position: 'TOP',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'JUNGLE',  department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'MID',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'BOT',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'SUPPORT', department: '', name: '', tier: '', champion: '', photo: ''}
  ]},
  {club: 'EL', name: 'EL TEAM 2', players: [
    {position: 'TOP',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'JUNGLE',  department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'MID',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'BOT',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'SUPPORT', department: '', name: '', tier: '', champion: '', photo: ''}
  ]},
  {club: 'DASOM', name: 'DASOM TEAM 1', players: [
    {position: 'TOP',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'JUNGLE',  department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'MID',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'BOT',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'SUPPORT', department: '', name: '', tier: '', champion: '', photo: ''}
  ]},
  {club: 'DASOM', name: 'DASOM TEAM 2', players: [
    {position: 'TOP',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'JUNGLE',  department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'MID',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'BOT',     department: '', name: '', tier: '', champion: '', photo: ''},
    {position: 'SUPPORT', department: '', name: '', tier: '', champion: '', photo: ''}
  ]}
];

(() => {
  const list = document.getElementById('team-list');
  const filter = document.querySelector('.team-filter');
  if (!list) return;
  const TBA = '추후 공개';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const show = value => esc(value || TBA);
  const silhouette = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="38" r="18" fill="currentColor"/><path d="M14 100c0-22 16-36 36-36s36 14 36 36z" fill="currentColor"/></svg>';

  function playerCard(p, team) {
    const who = p.name ? `${team.name} ${p.position} ${p.name}` : `${team.name} ${p.position} 선수`;
    const photo = p.photo ? `<img src="${esc(p.photo)}" alt="${esc(who)}" loading="lazy">` : silhouette;
    return `<li class="player-card"><div class="player-photo">${photo}<span class="player-pos">${esc(p.position)}</span></div>
      <div class="player-body"><p class="player-dept">${show(p.department)}</p><p class="player-name">${show(p.name)}</p>
      <dl class="player-meta"><div><dt>티어</dt><dd>${show(p.tier)}</dd></div><div><dt>주 챔피언</dt><dd>${show(p.champion)}</dd></div></dl></div></li>`;
  }

  list.innerHTML = TEAMS.map(team => `<article class="team" data-club="${esc(team.club)}" aria-labelledby="team-${esc(team.name).replace(/\s+/g, '-')}">
    <header class="team-head"><span class="club-badge">${esc(team.club)}</span><h3 id="team-${esc(team.name).replace(/\s+/g, '-')}">${esc(team.name)}</h3></header>
    <ul class="player-list">${team.players.map(p => playerCard(p, team)).join('')}</ul></article>`).join('');

  filter?.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    filter.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    list.querySelectorAll('.team').forEach(team => { team.hidden = button.dataset.filter !== 'ALL' && team.dataset.club !== button.dataset.filter; });
  });
})();
