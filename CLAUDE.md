# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**서버 모니터링 대시보드**

바닐라 JavaScript로 구현한 실시간 서버 모니터링 웹 애플리케이션입니다. 외부 프레임워크 없이 순수 JavaScript(ES6+)를 활용하여 서버 메트릭 데이터를 시각화하고, 로그를 분석하는 대시보드를 구축합니다.

### 주요 기능
1. **서버 모니터링**: 실시간 서버 상태 모니터링 및 시각화
2. **메트릭 데이터 분석**: CPU, 메모리, 디스크, 네트워크 사용량 분석
3. **로그 분석**: 특정 패턴 및 에러 로그 검색, 필터링, 통계

## 개발 환경 설정

### 로컬 서버 실행

Python을 사용하는 경우:
```bash
cd module3
python -m http.server 8000
```

Node.js를 사용하는 경우:
```bash
cd module3
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000/src/index.html` 접속

## 아키텍처

### 설계 패턴

**MVC 패턴**을 기반으로 합니다:
- **Model**: `js/data/` 디렉토리에서 서버 메트릭 및 로그 데이터 관리
- **View**: `js/components/` 디렉토리의 컴포넌트들이 대시보드 UI 렌더링
- **Controller**: `js/app.js`가 데이터 폴링, 이벤트 처리, 비즈니스 로직 조정

### 데이터 흐름

```
[서버 API / Mock Data]
    ↓ (Fetch API / 폴링)
[데이터 수집 & 파싱] (js/api.js)
    ↓
[데이터 모델 업데이트] (js/data/metrics.js, logs.js)
    ↓
[데이터 분석 & 처리] (js/analyzer.js)
    ↓
[UI 컴포넌트 렌더링] (js/components/)
    ↓
[차트/그래프 시각화] (Chart.js or Canvas API)
    ↓
[사용자 인터랙션] (필터링, 검색, 알림)
```

### 모듈 구조

**코어 모듈:**
- **js/app.js**: 애플리케이션 진입점, 데이터 폴링 관리, 전역 상태
- **js/api.js**: 서버 API 통신 또는 Mock 데이터 생성
- **js/utils.js**: 유틸리티 함수 (날짜 포맷팅, 단위 변환, 통계 계산)
- **js/storage.js**: localStorage 래퍼 (설정, 임계값 저장)

**데이터 레이어:**
- **js/data/metrics.js**: 서버 메트릭 데이터 모델 (CPU, 메모리, 디스크, 네트워크)
- **js/data/logs.js**: 로그 데이터 모델 (로그 파싱, 필터링, 검색)
- **js/analyzer.js**: 데이터 분석 로직 (평균, 추세, 이상 감지)

**UI 컴포넌트:**
- **js/components/Dashboard.js**: 메인 대시보드 레이아웃
- **js/components/MetricsCard.js**: 메트릭 카드 (CPU, 메모리 등 개별 표시)
- **js/components/Chart.js**: 차트 시각화 컴포넌트
- **js/components/LogViewer.js**: 로그 뷰어 (검색, 필터링, 하이라이트)
- **js/components/AlertPanel.js**: 알림 패널 (임계값 초과 알림)
- **js/components/FilterBar.js**: 필터 및 검색 바

## 기술 스택 (미니멀 스택)

### 프론트엔드
- **HTML5**
  - 시맨틱 마크업 (`<header>`, `<main>`, `<section>`, `<article>`)
  - 폼 요소 (`<form>`, `<input>`, `<button>`)
  - 접근성 속성 (ARIA)

- **CSS3**
  - Flexbox & Grid 레이아웃
  - CSS Variables (`:root`, `var()`)
  - 미디어 쿼리 (반응형 디자인)
  - 애니메이션 & 트랜지션
  - 의사 클래스/요소 (`:hover`, `:focus`, `::before`)

- **Vanilla JavaScript (ES6+)**
  - ES Modules (`import`/`export`)
  - 클래스 (`class`, `constructor`, `extends`)
  - 화살표 함수 (`=>`)
  - 템플릿 리터럴 (`` `${변수}` ``)
  - 구조 분해 할당 (`const { a, b } = obj`)
  - 스프레드 연산자 (`...arr`)
  - Promise & async/await
  - 배열 메서드 (`map`, `filter`, `reduce`, `find`)

### 브라우저 API
- **Web Storage API**
  - `localStorage` (영구 저장)
  - `sessionStorage` (세션 저장)

- **DOM API**
  - `document.querySelector()`, `querySelectorAll()`
  - `createElement()`, `appendChild()`, `remove()`
  - `innerHTML`, `textContent`, `classList`

- **Event API**
  - `addEventListener()`, `removeEventListener()`
  - 이벤트 객체 (`event.preventDefault()`, `event.target`)
  - 이벤트 위임 (Event Delegation)

- **Fetch API**
  - `fetch()` (서버 API 호출)
  - Promise 체이닝
  - async/await 패턴

- **Notification API**
  - `Notification.requestPermission()`
  - 임계값 초과 시 브라우저 알림

- **Performance API** (선택 사항)
  - 렌더링 성능 측정
  - 메모리 사용량 모니터링

- **Canvas API** (차트 구현 시)
  - `<canvas>` 요소
  - 2D Context
  - 실시간 라인 차트 그리기

### 개발 도구
- **로컬 서버**
  - Python: `python -m http.server 8000`
  - Node.js: `npx http-server -p 8000`

- **버전 관리**
  - Git (커밋, 브랜치, 머지)
  - GitHub (원격 저장소)

- **브라우저 도구**
  - Chrome DevTools (요소 검사, 콘솔, 네트워크, 성능)
  - Firefox Developer Tools

- **코드 에디터**
  - VS Code (추천 확장: Live Server, ESLint, Prettier)

## 코딩 규칙

### JavaScript

- ES6 모듈 시스템 사용 (`import`/`export`)
- 클래스 기반 컴포넌트 구조
- async/await로 비동기 처리
- 모든 사용자 입력은 XSS 방어를 위해 이스케이프 처리
- 에러 처리는 try-catch와 사용자 알림으로 처리

### CSS

- CSS Variables를 사용한 테마 관리:
  ```css
  --primary-color: #667eea
  --secondary-color: #764ba2
  --success-color: #48bb78
  --error-color: #f56565
  ```
- 반응형 중단점: 모바일(~640px), 태블릿(641~1024px), 데스크톱(1025px~)
- BEM 또는 명확한 클래스 명명 규칙 사용

### 접근성

- 모든 인터랙티브 요소는 키보드로 접근 가능해야 함
- ARIA 속성을 적절히 사용
- 색상 대비는 WCAG 2.1 AA 준수
- 포커스 인디케이터를 명확하게 표시

## 핵심 기능 우선순위

### 1. 서버 모니터링 기능

**P0 (필수)**:
- **M-001: 실시간 메트릭 표시**
  - CPU 사용률 (%)
  - 메모리 사용률 (MB/GB)
  - 디스크 사용률 (GB/TB)
  - 네트워크 사용량 (Mbps)

- **M-002: 메트릭 데이터 수집**
  - Mock 데이터 생성 (개발 환경)
  - 서버 API 연동 (프로덕션)
  - 자동 폴링 (5초~30초 간격)

- **M-003: 대시보드 UI**
  - 메트릭 카드 레이아웃
  - 실시간 업데이트
  - 반응형 디자인

**P1 (중요)**:
- **M-004: 메트릭 시각화**
  - 실시간 라인 차트 (시계열 데이터)
  - 게이지 차트 (현재 상태)
  - 막대 그래프 (비교)

- **M-005: 임계값 알림**
  - 임계값 설정 (CPU > 80%, 메모리 > 90% 등)
  - 임계값 초과 시 시각적 알림
  - 브라우저 알림 (Notification API)

### 2. 로그 분석 기능

**P0 (필수)**:
- **L-001: 로그 데이터 표시**
  - 로그 목록 렌더링 (타임스탬프, 레벨, 메시지)
  - 로그 레벨 구분 (INFO, WARN, ERROR, DEBUG)
  - 페이지네이션 (100개 단위)

- **L-002: 로그 검색**
  - 키워드 검색
  - 정규표현식 검색
  - 검색 결과 하이라이트

**P1 (중요)**:
- **L-003: 로그 필터링**
  - 로그 레벨 필터 (ERROR만, WARN 이상 등)
  - 시간 범위 필터 (최근 1시간, 오늘, 사용자 지정)
  - 다중 필터 조합

- **L-004: 로그 통계**
  - 레벨별 개수 (에러 N개, 경고 N개)
  - 시간대별 분포
  - 에러 패턴 분석

**P2 (보통)**:
- **L-005: 로그 내보내기**
  - 필터링된 로그 CSV/JSON 다운로드
  - 클립보드 복사

- **M-006: 히스토리 차트**
  - 과거 메트릭 데이터 시각화 (최근 1시간, 24시간)
  - 줌/팬 인터랙션

**P3 (낮음)**:
- **G-001: 테마 전환** (라이트/다크 모드)
- **G-002: 대시보드 커스터마이징** (위젯 배치)
- **G-003: 알림 설정 저장** (localStorage)

## 성능 요구사항

- **페이지 초기 로드**: 2초 이내
- **데이터 폴링 간격**: 5~30초 (설정 가능)
- **차트 렌더링**: 60 FPS 유지
- **로그 렌더링**: 1000개 항목까지 가상 스크롤 적용
- **메모리 누수 방지**:
  - 이벤트 리스너 정리
  - 폴링 타이머 정리
  - 차트 인스턴스 정리
- **인터랙션 응답**: 100ms 이내 시각적 피드백

## 데이터 구조 예시

### 메트릭 데이터
```javascript
{
  timestamp: 1704067200000, // Unix timestamp
  cpu: 45.2,                // CPU 사용률 (%)
  memory: {
    used: 4096,             // 사용 메모리 (MB)
    total: 8192             // 전체 메모리 (MB)
  },
  disk: {
    used: 250,              // 사용 디스크 (GB)
    total: 500              // 전체 디스크 (GB)
  },
  network: {
    in: 10.5,               // 인바운드 (Mbps)
    out: 5.2                // 아웃바운드 (Mbps)
  }
}
```

### 로그 데이터
```javascript
{
  id: 'log-001',
  timestamp: 1704067200000,
  level: 'ERROR',           // INFO, WARN, ERROR, DEBUG
  message: 'Database connection failed',
  source: 'api-server',
  metadata: {
    userId: 'user123',
    requestId: 'req-456'
  }
}
```

## 브라우저 호환성

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 개발 시작 가이드

### Phase 1: Mock 데이터 및 기본 UI (1-2주)
1. HTML 구조 작성 (대시보드 레이아웃)
2. CSS 스타일링 (카드, 그리드, 테마)
3. Mock 데이터 생성 (`assets/mock-data/`)
4. 메트릭 카드 컴포넌트 구현
5. 로그 뷰어 기본 구현

### Phase 2: 실시간 데이터 & 차트 (2-3주)
1. 데이터 폴링 로직 구현 (`js/api.js`)
2. 차트 라이브러리 선택 또는 Canvas API로 직접 구현
3. 실시간 라인 차트 구현
4. 메트릭 데이터 자동 업데이트

### Phase 3: 로그 분석 기능 (1-2주)
1. 로그 검색 기능 (키워드, 정규식)
2. 로그 필터링 (레벨, 시간)
3. 검색 결과 하이라이트
4. 로그 통계 계산

### Phase 4: 알림 & 최적화 (1주)
1. 임계값 설정 UI
2. 임계값 초과 알림
3. 성능 최적화 (가상 스크롤, 디바운싱)
4. 메모리 누수 체크

## 구현 팁

### 차트 구현
- **옵션 1**: Chart.js (간단, 빠른 구현)
- **옵션 2**: Canvas API (완전 제어, 학습 목적)
- **옵션 3**: SVG + D3.js (복잡한 인터랙션)

### 데이터 폴링
```javascript
class DataPoller {
  constructor(fetchFn, interval = 5000) {
    this.fetchFn = fetchFn;
    this.interval = interval;
    this.timerId = null;
  }

  start() {
    this.fetchFn(); // 즉시 실행
    this.timerId = setInterval(this.fetchFn, this.interval);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
```

### 로그 검색 (정규식)
```javascript
function searchLogs(logs, pattern) {
  const regex = new RegExp(pattern, 'i'); // 대소문자 무시
  return logs.filter(log => regex.test(log.message));
}
```

### 가상 스크롤 (대량 로그 처리)
```javascript
class VirtualScroller {
  constructor(container, itemHeight, totalItems) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
  }

  render(startIndex) {
    // startIndex부터 visibleItems만큼만 렌더링
  }
}
```

## 디렉토리 구조

```
module3/
├── src/                    # HTML 파일
│   └── index.html          # 메인 대시보드 페이지
│
├── css/                    # 스타일시트
│   ├── main.css            # 전역 스타일, CSS 변수
│   ├── dashboard.css       # 대시보드 레이아웃
│   ├── components.css      # 컴포넌트 스타일
│   └── charts.css          # 차트 스타일
│
├── js/                     # JavaScript 모듈
│   ├── app.js              # 애플리케이션 진입점, 폴링 관리
│   ├── api.js              # API 통신 / Mock 데이터 생성
│   ├── utils.js            # 유틸리티 함수
│   ├── storage.js          # localStorage 래퍼
│   ├── analyzer.js         # 데이터 분석 로직
│   │
│   ├── data/               # 데이터 모델
│   │   ├── metrics.js      # 메트릭 데이터 모델
│   │   └── logs.js         # 로그 데이터 모델
│   │
│   └── components/         # UI 컴포넌트
│       ├── Dashboard.js    # 메인 대시보드
│       ├── MetricsCard.js  # 메트릭 카드
│       ├── Chart.js        # 차트 컴포넌트
│       ├── LogViewer.js    # 로그 뷰어
│       ├── AlertPanel.js   # 알림 패널
│       └── FilterBar.js    # 필터/검색 바
│
├── assets/                 # 정적 리소스
│   ├── images/             # 아이콘, 이미지
│   └── mock-data/          # Mock 데이터 (개발용)
│       ├── metrics.json    # 샘플 메트릭 데이터
│       └── logs.json       # 샘플 로그 데이터
│
└── .claude/
    └── docs/
        └── PRD.md          # 프로젝트 요구사항 문서
```
