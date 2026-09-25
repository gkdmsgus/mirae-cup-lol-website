# 2026 LCC — 리그 오브 레전드 대회

NYPC의 검은 배경과 강한 타이포그래피를 참고해, 사용자가 제공한 트로피의 블루·실버에 맞춘 리그 오브 레전드(LoL) 대회용 반응형 단일 페이지 홈페이지입니다. NYPC·넥슨·Riot Games의 공식 홈페이지가 아니며, 해당 브랜드의 로고나 운영 정보를 복제하지 않았습니다.

## 배포

Netlify(https://2026-lcc.netlify.app/)에 배포합니다. 저장소 루트의 `netlify.toml`이 `dist` 폴더만 공개하도록 지정합니다.

## 실행

`dist/index.html`을 브라우저에서 열면 됩니다. 별도 설치나 빌드는 필요 없습니다. 웹 서버에서는 `dist` 폴더를 루트로 제공합니다.

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

## 내용과 전제

- 대회명은 `2026 LCC`(League of Legends Champions, Computer Engineering)입니다. 종목은 리그 오브 레전드입니다.
- 참가 신청은 외부 구글폼으로 받습니다. 참가 선수는 ‘추후 공개’(LINE-UP 섹션)이며, 사이트 자체에는 개인정보 수집 기능이 없습니다.
- 사용자 제공 트로피 PNG를 가공 없이 사용했습니다. 원본 크기 357 × 516 px입니다.
- 색상: 배경 `#080b12`, 파랑 `#32aaff`, 실버 `#c7d2df`.
- 영문 Barlow Condensed, 한글 Noto Sans KR. Google Fonts가 차단되면 시스템 글꼴로 대체됩니다.
- PC 내비게이션, 모바일 펼침 메뉴, 구간 이동, 맨 위로 이동, 키보드 접근, 모션 감소 설정을 지원합니다.
- 신청 기능·로그인·서버 데이터 저장은 포함하지 않았습니다. 실제 대회 운영 전 규정과 운영 주체를 확정하고 연결해야 합니다.

## 수정할 곳

- `dist/index.html`: 제목, 대회 안내, 운영진 명단
- `dist/styles.css`: 색상, 글꼴, 화면 배치
- `dist/app.js`: 모바일 메뉴
- `dist/teams.js`: (현재 숨김 — `index.html`의 `#teams` 섹션 주석 참고) 참가 팀·선수 정보 (학과, 이름, 티어, 주 챔피언, 사진). 비워 둔 값은 "추후 공개"로 표시. 사진은 `dist/assets/players/`에 넣고 경로를 적으면 됩니다.
- 첫 방문 공지 팝업: 문구는 `dist/index.html`의 `<dialog id="notice">`, 동작은 `dist/notice.js` ("오늘 하루 보지 않기"는 방문자 브라우저에 날짜 저장)
- 대회 포스터: 세로 `dist/assets/poster.webp`(첫 화면 배경, 모바일 슬로건 배경), 가로 `dist/assets/poster-wide.webp`(PC 슬로건 배경), 링크 미리보기 `dist/assets/og-image.jpg`(1200×630). 배포 주소(https://2026-lcc.netlify.app/)가 바뀌면 `index.html`의 `og:url`·`og:image`도 바꿔야 합니다.
- `dist/space.js`: 우주 배경의 별·별똥별 애니메이션 (성운 색과 움직임은 `dist/styles.css`의 `.nebula`)
- `dist/assets/trophy-lcc.png`: 사용자 제공 트로피

## 검증 계획

1. 모든 구간 링크의 대상 존재, 이미지 파일 및 크기 확인
2. 자바스크립트 문법 검사
3. PC 1440 px, 모바일 390 px / 320 px에서 가로 넘침·텍스트/이미지 잘림 확인
4. 모바일 메뉴의 열기·닫기·링크 선택·Escape 키·크기 변경 동작
5. 운영진 명단과 동아리 로고 표시
6. 이미지 로드, 브라우저 콘솔 오류, 문서 제목·한국어 언어 표시 확인

## 팀장 전달본

사용자 요청에 따라 온라인 게시 없이 ZIP으로 전달합니다. 압축을 **모두 풀고**, `dist/index.html`을 Chrome 또는 Edge로 열면 됩니다. ZIP 내부에서 바로 열면 이미지와 스타일이 누락될 수 있습니다.

이미지와 소스가 모두 포함되어 있어 다른 컴퓨터에서도 실행할 수 있습니다. 인터넷 연결은 Google Fonts 로딩에만 사용됩니다. 인터넷이 없어도 시스템 글꼴로 페이지와 메뉴가 동작합니다.

현재 온라인 공개본은 없으며, 전달본에는 온라인 게시용 계정 정보나 설정을 포함하지 않았습니다.

참고한 원본: https://www.nypc.co.kr/main/main.do (2026-09-23 실제 화면 확인). 지식 볼트에는 이 대회의 확정 명칭·일정·규정이 없습니다.
