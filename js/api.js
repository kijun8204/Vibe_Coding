/**
 * API 통신 및 Mock 데이터 관리
 */

import { config } from './config.js';

// 로그 관련 상수
const LOG_LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
const LOG_SOURCES = ['system', 'database', 'api-server', 'auth-service', 'monitor'];
const LOG_MESSAGES = [
  '서버가 정상적으로 시작되었습니다',
  '데이터베이스 연결 성공',
  'API 요청 처리 완료',
  '사용자 로그인 성공',
  '메모리 사용률이 높습니다',
  '캐시 데이터 갱신 완료',
  '데이터베이스 연결 실패',
  'API 요청 실패',
  '디스크 사용률 경고',
  '시스템 상태 정상'
];

/**
 * 메트릭 데이터 가져오기
 * @returns {Promise<Array>} 메트릭 데이터 배열
 */
export async function fetchMetrics() {
  if (config.useMockData) {
    return fetchMockMetrics();
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/metrics`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('메트릭 데이터 가져오기 실패:', error);
    throw error;
  }
}

/**
 * 로그 데이터 가져오기
 * @returns {Promise<Array>} 로그 데이터 배열
 */
export async function fetchLogs() {
  if (config.useMockData) {
    return fetchMockLogs();
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/logs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('로그 데이터 가져오기 실패:', error);
    throw error;
  }
}

/**
 * Mock 메트릭 데이터 가져오기
 * @returns {Promise<Array>} Mock 메트릭 데이터
 */
async function fetchMockMetrics() {
  try {
    const response = await fetch('../assets/mock-data/metrics.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('📊 Mock 메트릭 데이터 로드:', data.length, '개');
    return data;
  } catch (error) {
    console.error('Mock 메트릭 데이터 로드 실패:', error);
    // 실패 시 동적으로 생성된 Mock 데이터 반환
    return generateMockMetrics();
  }
}

/**
 * Mock 로그 데이터 가져오기
 * @returns {Promise<Array>} Mock 로그 데이터
 */
async function fetchMockLogs() {
  try {
    const response = await fetch('../assets/mock-data/logs.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('📝 Mock 로그 데이터 로드:', data.length, '개');
    return data;
  } catch (error) {
    console.error('Mock 로그 데이터 로드 실패:', error);
    // 실패 시 동적으로 생성된 Mock 데이터 반환
    return generateMockLogs();
  }
}

/**
 * 동적으로 Mock 메트릭 데이터 생성
 * @param {number} count - 생성할 데이터 개수
 * @returns {Array} Mock 메트릭 데이터 배열
 */
function generateMockMetrics(count = 12) {
  const metrics = [];
  const now = Date.now();
  const interval = 5000; // 5초 간격

  for (let i = 0; i < count; i++) {
    metrics.push({
      timestamp: now - (count - i - 1) * interval,
      cpu: Math.random() * 100,
      memory: {
        used: Math.floor(Math.random() * 4096) + 2048,
        total: 8192
      },
      disk: {
        used: Math.floor(Math.random() * 100) + 200,
        total: 500
      },
      network: {
        in: Math.random() * 30,
        out: Math.random() * 15
      }
    });
  }

  console.log('🔄 동적 Mock 메트릭 데이터 생성:', count, '개');
  return metrics;
}

/**
 * 동적으로 Mock 로그 데이터 생성
 * @param {number} count - 생성할 데이터 개수
 * @returns {Array} Mock 로그 데이터 배열
 */
function generateMockLogs(count = 20) {
  const logs = [];
  const now = Date.now();
  const interval = 5000; // 5초 간격

  for (let i = 0; i < count; i++) {
    const level = LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)];
    const source = LOG_SOURCES[Math.floor(Math.random() * LOG_SOURCES.length)];
    const message = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];

    logs.push({
      id: `log-${String(i + 1).padStart(3, '0')}`,
      timestamp: now - (count - i - 1) * interval,
      level,
      message,
      source,
      metadata: {
        requestId: `req-${Math.random().toString(36).substr(2, 9)}`
      }
    });
  }

  console.log('🔄 동적 Mock 로그 데이터 생성:', count, '개');
  return logs;
}

/**
 * 실시간으로 새로운 Mock 메트릭 생성
 * @returns {Object} 새로운 메트릭 데이터
 */
export function generateRealtimeMetric() {
  return {
    timestamp: Date.now(),
    cpu: Math.random() * 100,
    memory: {
      used: Math.floor(Math.random() * 4096) + 2048,
      total: 8192
    },
    disk: {
      used: Math.floor(Math.random() * 100) + 200,
      total: 500
    },
    network: {
      in: Math.random() * 30,
      out: Math.random() * 15
    }
  };
}

/**
 * 실시간으로 새로운 Mock 로그 생성
 * @returns {Object} 새로운 로그 데이터
 */
export function generateRealtimeLog() {
  return {
    id: `log-${Date.now()}`,
    timestamp: Date.now(),
    level: LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)],
    message: LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)],
    source: LOG_SOURCES[Math.floor(Math.random() * LOG_SOURCES.length)],
    metadata: {
      requestId: `req-${Math.random().toString(36).substr(2, 9)}`
    }
  };
}
