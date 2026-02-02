/**
 * 애플리케이션 설정
 */

/**
 * 개발 모드 여부 감지
 * - localhost 또는 127.0.0.1에서 실행 중이면 개발 모드
 * - file:// 프로토콜도 개발 모드로 간주
 */
function isDevelopment() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '' || // file:// 프로토콜
    protocol === 'file:'
  );
}

/**
 * 애플리케이션 설정
 */
export const config = {
  // Mock 데이터 사용 여부 (개발 환경에서만 true)
  useMockData: isDevelopment(),

  // API 기본 URL
  apiBaseUrl: '/api',

  // 폴링 설정
  polling: {
    interval: 5000, // 5초
    maxErrors: 3    // 최대 연속 에러 허용 횟수
  },

  // 알림 설정
  alert: {
    duration: 3000  // 3초
  },

  // 로그 설정
  logs: {
    pageSize: 100,
    enableVirtualScroll: false
  },

  // 메트릭 설정
  metrics: {
    maxHistorySize: 50,
    threshold: {
      warning: 70,
      critical: 90
    }
  }
};
