# 서버 모니터링 대시보드

바닐라 JavaScript로 구현한 실시간 서버 모니터링 웹 애플리케이션입니다. 외부 프레임워크 없이 순수 JavaScript(ES6+)를 활용하여 서버 메트릭 데이터를 시각화하고, 로그를 분석하는 대시보드를 제공합니다.

## 주요 기능

### 실시간 메트릭 모니터링
- CPU, 메모리, 디스크, 네트워크 사용률 실시간 표시
- 5초 간격 자동 갱신 (설정 가능)
- 상태 배지 (정상/경고/위험)
- 수동 새로고침 기능

### 로그 분석
- 로그 레벨별 필터링 (INFO, WARN, ERROR, DEBUG)
- 키워드 검색 (300ms 디바운스 적용)
- 검색어 하이라이트
- 레벨별 로그 통계

### 보안 및 성능
- XSS 방어 (HTML 이스케이프)
- ReDoS 방어 (정규식 특수문자 이스케이프)
- 이벤트 리스너 메모리 누수 방지
- 폴링 에러 처리 (연속 3회 실패 시 자동 중지)

## 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업, ARIA 접근성 속성
- **CSS3**: Flexbox/Grid 레이아웃, CSS Variables, 반응형 디자인
- **Vanilla JavaScript (ES6+)**: ES Modules, Classes, async/await

### 설계 패턴
- **MVC 패턴**: Model-View-Controller 아키텍처
- **컴포넌트 기반 구조**: 재사용 가능한 UI 컴포넌트
- **환경별 설정 관리**: 개발/프로덕션 자동 감지

### 브라우저 API
- Fetch API (데이터 폴링)
- DOM API (렌더링)
- Web Storage API (설정 저장, Phase 3 구현 예정)
- Notification API (알림, Phase 4 구현 예정)

## 프로젝트 구조

```
module3/
├── src/
│   └── index.html              # 메인 대시보드 페이지
├── css/
│   ├── main.css                # 전역 스타일, CSS 변수
│   ├── dashboard.css           # 대시보드 레이아웃
│   ├── components.css          # 컴포넌트 스타일
│   └── charts.css              # 차트 스타일
├── js/
│   ├── app.js                  # 애플리케이션 진입점, 폴링 관리
│   ├── api.js                  # API 통신 / Mock 데이터 생성
│   ├── config.js               # 환경 설정 중앙화
│   ├── utils.js                # 유틸리티 함수 (날짜, XSS 방어)
│   └── components/
│       ├── Dashboard.js        # 메인 대시보드 컴포넌트
│       ├── MetricsCard.js      # 메트릭 카드 컴포넌트
│       └── LogViewer.js        # 로그 뷰어 컴포넌트
├── assets/
│   └── mock-data/
│       ├── metrics.json        # 샘플 메트릭 데이터
│       └── logs.json           # 샘플 로그 데이터
├── docs/
│   ├── plan.md                 # 개발 계획서
│   ├── progress.md             # 진행 상황 체크리스트
│   ├── test-checklist.md       # 상세 테스트 체크리스트
│   └── quick-test.md           # 5분 빠른 테스트 가이드
├── .vscode/
│   └── launch.json             # VSCode 디버깅 설정
├── start-server.bat            # Windows 로컬 서버 실행 스크립트
└── README.md                   # 프로젝트 안내서 (이 파일)
```

## 설치 및 실행

### 1. 로컬 서버 시작

#### 방법 A: VSCode Live Server (권장)
1. VSCode에서 Live Server 확장 설치
2. `src/index.html` 파일에서 우클릭
3. "Open with Live Server" 선택

#### 방법 B: Python HTTP 서버
```bash
cd module3
python -m http.server 8000
```

#### 방법 C: Node.js HTTP 서버
```bash
cd module3
npx http-server -p 8000
```

### 2. 브라우저에서 접속
- Live Server 사용 시: 자동으로 브라우저가 열립니다
- Python/Node.js 사용 시: `http://localhost:8000/src/index.html` 접속

### 3. 개발자 도구 열기 (선택사항)
- `F12` 또는 `Ctrl+Shift+I`
- 콘솔에서 폴링 로그 확인 가능

## 개발 현황

### 완료된 기능 (Phase 1) ✅
- [x] HTML 구조: 대시보드 레이아웃, 메트릭 카드, 로그 뷰어
- [x] CSS 스타일링: Variables, 반응형 디자인 (모바일/태블릿/데스크톱)
- [x] Mock 데이터 생성
- [x] 메트릭 카드 컴포넌트 (CPU, 메모리, 디스크, 네트워크)
- [x] 로그 뷰어 기본 기능
- [x] 데이터 폴링 (5초 간격, 에러 처리)
- [x] 로그 검색 및 필터링
- [x] 로그 통계 (레벨별 개수)
- [x] 보안 이슈 수정 (XSS, ReDoS 방어)
- [x] 메모리 누수 방지
- [x] 디바운스/스로틀 적용

### 진행 중 (Phase 2) 🔄
- [ ] 차트 라이브러리 선택 또는 Canvas API 결정
- [ ] 실시간 라인 차트 구현 (CPU, 메모리, 네트워크)
- [ ] 게이지 차트 (현재 상태)
- [ ] 차트 데이터 자동 업데이트

### 계획 중 (Phase 3, 4)
- [ ] 시간 범위 필터 (최근 1시간, 오늘, 사용자 지정)
- [ ] localStorage 저장 (필터 상태, 설정)
- [ ] 가상 스크롤 (대량 로그 최적화)
- [ ] 임계값 알림 (CPU > 80%, 메모리 > 90% 등)
- [ ] 브라우저 알림 (Notification API)
- [ ] 로그 내보내기 (CSV, JSON)

### 전체 진행률
- **Phase 1**: 17/17 (100%) ✅
- **Phase 2**: 7/9 (78%) 🔄
- **Phase 3**: 8/14 (57%) 🔄
- **Phase 4**: 3/15 (20%) 🔄
- **전체**: 35/79 (44%)

자세한 진행 상황은 [`docs/progress.md`](docs/progress.md)를 참조하세요.

## 테스트

### 빠른 기능 테스트 (5분)
[`docs/quick-test.md`](docs/quick-test.md) 가이드를 따라 주요 기능을 빠르게 테스트할 수 있습니다.

**주요 테스트 항목:**
1. 페이지 로드 및 메트릭 카드 표시
2. 자동 갱신 (5초 간격)
3. 로그 검색 및 필터링
4. 새로고침 버튼
5. 반응형 디자인

### 상세 테스트 체크리스트
전체 기능 테스트는 [`docs/test-checklist.md`](docs/test-checklist.md)를 참조하세요. (12개 섹션, 100개 이상 체크 항목)

### VSCode 디버깅
`.vscode/launch.json`에 Chrome 및 Edge 디버깅 설정이 포함되어 있습니다.

1. VSCode에서 `F5` 또는 "Run and Debug" 선택
2. "Launch Chrome" 또는 "Launch Edge" 선택
3. 중단점 설정 후 디버깅 가능

## 개발 로드맵

### Phase 1: Mock 데이터 및 기본 UI ✅ (완료)
- HTML 구조, CSS 스타일링, Mock 데이터, 기본 컴포넌트

### Phase 2: 실시간 데이터 & 차트 🔄 (진행 중)
- 데이터 폴링, 차트 라이브러리 선택, 실시간 시각화

### Phase 3: 로그 분석 기능 🔄 (부분 완료)
- 로그 검색 ✅, 필터링 ✅, 시간 범위 필터, 가상 스크롤

### Phase 4: 알림 & 최적화
- 임계값 알림, 브라우저 알림, 성능 최적화

자세한 개발 계획은 [`docs/plan.md`](docs/plan.md)를 참조하세요.

## 코딩 규칙

### JavaScript
- ES6+ 모듈 시스템 사용 (`import`/`export`)
- 클래스 기반 컴포넌트 구조
- async/await로 비동기 처리
- 모든 사용자 입력은 XSS 방어를 위해 이스케이프 처리
- 에러 처리는 try-catch와 사용자 알림으로 처리

### CSS
- CSS Variables를 사용한 테마 관리
- 반응형 중단점: 모바일(~640px), 태블릿(641~1024px), 데스크톱(1025px~)
- BEM 또는 명확한 클래스 명명 규칙 사용

### 접근성
- 모든 인터랙티브 요소는 키보드로 접근 가능
- ARIA 속성을 적절히 사용
- 색상 대비는 WCAG 2.1 AA 준수

## 브라우저 호환성

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 기여 방법

1. 이 저장소를 Fork합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 브랜치에 Push합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

### 커밋 메시지 컨벤션
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 스타일 변경 (포맷팅)
- `docs`: 문서 업데이트
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 파일 변경

## 라이선스

MIT License

## 문의

문제나 제안사항이 있으시면 [Issues](../../issues)에 등록해주세요.

---

**개발 기간**: 2026-02-02 ~ 진행 중
**개발 환경**: Windows 11, VSCode, Chrome DevTools
**학습 목적**: 바닐라 JavaScript 실전 프로젝트
