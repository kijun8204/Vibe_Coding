/**
 * LogViewer 컴포넌트
 * 로그 목록 렌더링, 필터링, 검색 기능
 */

import { formatDate, escapeHTML } from '../utils.js';

export class LogViewer {
  constructor(container, config = {}) {
    this.container = container;
    this.config = {
      pageSize: config.pageSize || 100,
      enableVirtualScroll: config.enableVirtualScroll || false,
      ...config
    };

    this.state = {
      logs: [],
      filteredLogs: [],
      currentPage: 1,
      totalPages: 1,
      filters: {
        level: 'all',
        searchQuery: '',
        timeRange: 'all'
      }
    };

    this.elements = {};
    this.init();
  }

  /**
   * 초기화
   */
  init() {
    if (!this.container) {
      console.error('LogViewer container not found');
      return;
    }

    this.cacheElements();
    console.log('✅ LogViewer 초기화');
  }

  /**
   * DOM 요소 캐싱
   */
  cacheElements() {
    this.elements = {
      container: this.container,
      emptyState: document.getElementById('emptyState')
    };
  }

  /**
   * 로그 데이터 업데이트
   * @param {Array} logs - 로그 배열
   */
  update(logs) {
    if (!Array.isArray(logs)) {
      console.error('Invalid logs data');
      return;
    }

    this.state.logs = logs;
    this.applyFilters();
    this.render();
  }

  /**
   * 필터 적용
   */
  applyFilters() {
    let filtered = [...this.state.logs];

    // 레벨 필터
    if (this.state.filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === this.state.filters.level);
    }

    // 검색 필터
    if (this.state.filters.searchQuery) {
      const query = this.state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query)
      );
    }

    // TODO: Phase 3에서 시간 범위 필터 구현

    this.state.filteredLogs = filtered;
    this.updatePagination();
  }

  /**
   * 페이지네이션 업데이트
   */
  updatePagination() {
    const totalLogs = this.state.filteredLogs.length;
    this.state.totalPages = Math.ceil(totalLogs / this.config.pageSize);

    // 현재 페이지가 총 페이지를 초과하면 조정
    if (this.state.currentPage > this.state.totalPages) {
      this.state.currentPage = Math.max(1, this.state.totalPages);
    }
  }

  /**
   * 현재 페이지의 로그 가져오기
   * @returns {Array} 현재 페이지의 로그
   */
  getCurrentPageLogs() {
    const start = (this.state.currentPage - 1) * this.config.pageSize;
    const end = start + this.config.pageSize;
    return this.state.filteredLogs.slice(start, end);
  }

  /**
   * 렌더링
   */
  render() {
    const logs = this.getCurrentPageLogs();

    // 빈 상태 처리
    if (logs.length === 0) {
      this.renderEmptyState();
      return;
    }

    // 로그 렌더링
    const logsHTML = logs.map(log => this.createLogEntryHTML(log)).join('');
    this.container.innerHTML = logsHTML;
  }

  /**
   * 빈 상태 렌더링
   */
  renderEmptyState() {
    const message = this.state.logs.length === 0
      ? '로그가 없습니다.'
      : '필터 조건에 맞는 로그가 없습니다.';

    this.container.innerHTML = `
      <div class="log-viewer__empty">
        <p>${message}</p>
      </div>
    `;
  }

  /**
   * 로그 항목 HTML 생성
   * @param {Object} log - 로그 데이터
   * @returns {string} HTML 문자열
   */
  createLogEntryHTML(log) {
    const timestamp = formatDate(new Date(log.timestamp), 'HH:mm:ss');
    const levelClass = `log-entry__level--${log.level.toLowerCase()}`;
    const message = this.highlightSearchQuery(escapeHTML(log.message));

    return `
      <div class="log-entry" data-log-id="${log.id}">
        <div class="log-entry__timestamp">${timestamp}</div>
        <div class="log-entry__level ${levelClass}">${log.level}</div>
        <div class="log-entry__message">${message}</div>
      </div>
    `;
  }

  /**
   * 검색어 하이라이트
   * @param {string} text - 원본 텍스트
   * @returns {string} 하이라이트된 HTML
   */
  highlightSearchQuery(text) {
    const query = this.state.filters.searchQuery;

    if (!query) return text;

    // 정규식 특수 문자 이스케이프 (ReDoS 방어)
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    try {
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } catch (error) {
      console.warn('검색어 하이라이트 실패:', error);
      return text; // 에러 발생 시 원본 텍스트 반환
    }
  }

  /**
   * 필터 설정
   * @param {Object} filters - 필터 객체
   */
  setFilters(filters) {
    this.state.filters = { ...this.state.filters, ...filters };
    this.applyFilters();
    this.render();
  }

  /**
   * 레벨 필터 설정
   * @param {string} level - 로그 레벨
   */
  setLevelFilter(level) {
    this.setFilters({ level });
  }

  /**
   * 검색어 설정
   * @param {string} query - 검색어
   */
  setSearchQuery(query) {
    this.setFilters({ searchQuery: query });
  }

  /**
   * 시간 범위 필터 설정
   * @param {string} timeRange - 시간 범위
   */
  setTimeRangeFilter(timeRange) {
    this.setFilters({ timeRange });
  }

  /**
   * 필터 초기화
   */
  clearFilters() {
    this.state.filters = {
      level: 'all',
      searchQuery: '',
      timeRange: 'all'
    };
    this.applyFilters();
    this.render();
  }

  /**
   * 페이지 이동
   * @param {number} page - 이동할 페이지 번호
   */
  goToPage(page) {
    if (page < 1 || page > this.state.totalPages) {
      console.warn(`Invalid page number: ${page}`);
      return;
    }

    this.state.currentPage = page;
    this.render();
  }

  /**
   * 다음 페이지
   */
  nextPage() {
    if (this.state.currentPage < this.state.totalPages) {
      this.goToPage(this.state.currentPage + 1);
    }
  }

  /**
   * 이전 페이지
   */
  prevPage() {
    if (this.state.currentPage > 1) {
      this.goToPage(this.state.currentPage - 1);
    }
  }

  /**
   * 로그 통계 계산
   * @returns {Object} 로그 통계
   */
  getStats() {
    const stats = {
      total: this.state.logs.length,
      ERROR: 0,
      WARN: 0,
      INFO: 0,
      DEBUG: 0
    };

    this.state.logs.forEach(log => {
      if (stats[log.level] !== undefined) {
        stats[log.level]++;
      }
    });

    return stats;
  }

  /**
   * 필터링된 로그 가져오기
   * @returns {Array} 필터링된 로그
   */
  getFilteredLogs() {
    return [...this.state.filteredLogs];
  }

  /**
   * 정리
   */
  destroy() {
    this.state.logs = [];
    this.state.filteredLogs = [];
    console.log('🧹 LogViewer 정리');
  }
}
