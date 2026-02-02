/**
 * 유틸리티 함수 모음
 */

/**
 * 날짜 포맷팅
 * @param {Date} date - 포맷팅할 날짜
 * @param {string} format - 포맷 문자열 (예: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!(date instanceof Date) || isNaN(date)) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 숫자 포맷팅 (소수점 자릿수 지정)
 * @param {number} num - 포맷팅할 숫자
 * @param {number} decimals - 소수점 자릿수
 * @returns {string} 포맷팅된 숫자 문자열
 */
export function formatNumber(num, decimals = 2) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  return num.toFixed(decimals);
}

/**
 * 바이트를 사람이 읽기 쉬운 형식으로 변환
 * @param {number} bytes - 바이트 수
 * @param {number} decimals - 소수점 자릿수
 * @returns {string} 포맷팅된 문자열 (예: '1.5 GB')
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 퍼센트 계산
 * @param {number} value - 현재 값
 * @param {number} total - 전체 값
 * @param {number} decimals - 소수점 자릿수
 * @returns {number} 퍼센트 값
 */
export function calculatePercentage(value, total, decimals = 2) {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
}

/**
 * 디바운스 함수
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간 (밀리초)
 * @returns {Function} 디바운스된 함수
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 스로틀 함수
 * @param {Function} func - 실행할 함수
 * @param {number} limit - 제한 시간 (밀리초)
 * @returns {Function} 스로틀된 함수
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 배열의 평균 계산
 * @param {Array<number>} arr - 숫자 배열
 * @returns {number} 평균 값
 */
export function average(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}

/**
 * 배열의 최댓값
 * @param {Array<number>} arr - 숫자 배열
 * @returns {number} 최댓값
 */
export function max(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return Math.max(...arr);
}

/**
 * 배열의 최솟값
 * @param {Array<number>} arr - 숫자 배열
 * @returns {number} 최솟값
 */
export function min(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return Math.min(...arr);
}

/**
 * 범위 내 값으로 제한
 * @param {number} value - 제한할 값
 * @param {number} min - 최솟값
 * @param {number} max - 최댓값
 * @returns {number} 제한된 값
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 랜덤 정수 생성
 * @param {number} min - 최솟값
 * @param {number} max - 최댓값
 * @returns {number} 랜덤 정수
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * UUID 생성 (간단한 버전)
 * @returns {string} UUID 문자열
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * HTML 이스케이프 (XSS 방지)
 * @param {string} str - 이스케이프할 문자열
 * @returns {string} 이스케이프된 문자열
 */
export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 쿼리 문자열 파싱
 * @param {string} queryString - 쿼리 문자열
 * @returns {Object} 파싱된 객체
 */
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

/**
 * 시간 차이 계산 (상대 시간)
 * @param {Date|number} date - 날짜 또는 타임스탬프
 * @returns {string} 상대 시간 문자열 (예: '3분 전')
 */
export function timeAgo(date) {
  const timestamp = date instanceof Date ? date.getTime() : date;
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) return `${seconds}초 전`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;
  const years = Math.floor(months / 12);
  return `${years}년 전`;
}

/**
 * 객체 깊은 복사
 * @param {Object} obj - 복사할 객체
 * @returns {Object} 복사된 객체
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 배열 청크 분할
 * @param {Array} arr - 분할할 배열
 * @param {number} size - 청크 크기
 * @returns {Array<Array>} 청크 배열
 */
export function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * 배열에서 중복 제거
 * @param {Array} arr - 배열
 * @returns {Array} 중복이 제거된 배열
 */
export function unique(arr) {
  return [...new Set(arr)];
}
