# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Module 3는 바닐라 JavaScript로 구현한 동적 웹 애플리케이션입니다. 외부 프레임워크 없이 순수 JavaScript(ES6+)의 기능을 활용하여 재사용 가능한 컴포넌트 기반 아키텍처를 구축합니다.

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
- **Model**: `js/storage.js`에서 데이터 관리 및 localStorage 연동
- **View**: `js/components/` 디렉토리의 컴포넌트들이 UI 렌더링 담당
- **Controller**: `js/app.js`가 이벤트 처리 및 비즈니스 로직 조정

### 데이터 흐름

```
사용자 입력 → 입력 검증 (Controller)
→ 데이터 모델 업데이트 (Model)
→ localStorage 자동 저장
→ UI 리렌더링 (View)
→ 사용자 피드백 (알림)
```

### 모듈 구조

- **js/app.js**: 애플리케이션 진입점, 전역 상태 관리, 이벤트 조정
- **js/utils.js**: 순수 유틸리티 함수 (날짜 포맷팅, 입력 검증 등)
- **js/storage.js**: localStorage 래퍼, CRUD 작업, 에러 처리
- **js/components/**: 재사용 가능한 UI 컴포넌트
  - `Form.js`: 데이터 입력 폼 컴포넌트
  - `List.js`: 데이터 목록 렌더링 컴포넌트
  - `Modal.js`: 모달 대화상자 컴포넌트

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox/Grid, CSS Variables, 애니메이션
- **JavaScript ES6+**: 모듈, 클래스, async/await
- **브라우저 API**: localStorage, DOM API, Event API

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

**P0 (필수)**:
- F-001: 데이터 입력 및 추가
- F-002: 데이터 조회 및 표시
- F-004: 데이터 삭제
- F-005: localStorage를 통한 데이터 영속성

**P1 (중요)**:
- F-003: 데이터 수정
- F-006: 검색 및 필터링

**P2 (보통)**:
- F-007: 정렬 기능
- F-008: 알림 시스템

**P3 (낮음)**:
- F-009: 테마 전환 (라이트/다크 모드)

## 성능 요구사항

- 페이지 초기 로드: 2초 이내
- 인터랙션 응답: 100ms 이내 시각적 피드백
- 1000개 항목까지 원활한 렌더링
- 메모리 누수 방지 (이벤트 리스너 정리 필수)

## 브라우저 호환성

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 디렉토리 구조

```
module3/
├── src/              # HTML 파일
│   └── index.html
├── css/              # 스타일시트
│   ├── main.css      # 전역 스타일
│   ├── components.css # 컴포넌트 스타일
│   └── utilities.css  # 유틸리티 클래스
├── js/               # JavaScript 모듈
│   ├── app.js        # 메인 앱 로직
│   ├── utils.js      # 유틸리티 함수
│   ├── storage.js    # 데이터 저장 로직
│   └── components/   # 재사용 가능한 컴포넌트
│       ├── Form.js
│       ├── List.js
│       └── Modal.js
├── assets/           # 정적 리소스
│   ├── images/
│   └── fonts/
└── .claude/
    └── docs/
        └── PRD.md    # 상세 요구사항 문서
```
