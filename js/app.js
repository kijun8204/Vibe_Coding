/**
 * 서버 모니터링 대시보드 - 메인 애플리케이션
 * 애플리케이션 진입점, 데이터 폴링 관리, 전역 상태
 */

import { fetchMetrics, fetchLogs } from './api.js';
import { formatDate, formatBytes, formatNumber, debounce } from './utils.js';
import { config } from './config.js';

class App {
  constructor() {
    this.state = {
      metrics: null,
      logs: [],
      filters: {
        level: 'all',
        timeRange: 'all',
        searchQuery: ''
      },
      polling: {
        interval: config.polling.interval,
        timerId: null,
        isActive: false,
        errorCount: 0,
        maxErrors: config.polling.maxErrors
      },
      lastUpdate: null
    };

    // 이벤트 핸들러 바인딩 저장 (메모리 누수 방지)
    this.handlers = null;

    this.init();
  }

  /**
   * 애플리케이션 초기화
   */
  async init() {
    console.log('🚀 서버 모니터링 대시보드 초기화...');

    try {
      // DOM 요소 초기화
      this.initDOMElements();

      // 이벤트 리스너 등록
      this.attachEventListeners();

      // 초기 데이터 로드
      await this.loadInitialData();

      // 폴링 시작
      this.startPolling();

      console.log('✅ 초기화 완료');
    } catch (error) {
      console.error('❌ 초기화 실패:', error);
      this.showAlert('error', '초기화 실패', '애플리케이션을 시작할 수 없습니다.');
    }
  }

  /**
   * DOM 요소 참조 저장
   */
  initDOMElements() {
    // 메트릭 관련
    this.elements = {
      // CPU
      cpuValue: document.getElementById('cpuValue'),
      cpuChart: document.getElementById('cpuChart'),

      // 메모리
      memoryValue: document.getElementById('memoryValue'),
      memoryTotal: document.getElementById('memoryTotal'),
      memoryChart: document.getElementById('memoryChart'),

      // 디스크
      diskValue: document.getElementById('diskValue'),
      diskTotal: document.getElementById('diskTotal'),
      diskChart: document.getElementById('diskChart'),

      // 네트워크
      networkIn: document.getElementById('networkIn'),
      networkOut: document.getElementById('networkOut'),
      networkChart: document.getElementById('networkChart'),

      // 로그
      logViewerContainer: document.getElementById('logViewerContainer'),
      emptyState: document.getElementById('emptyState'),
      logSearch: document.getElementById('logSearch'),
      levelFilter: document.getElementById('levelFilter'),
      timeFilter: document.getElementById('timeFilter'),

      // 통계
      statTotal: document.getElementById('statTotal'),
      statError: document.getElementById('statError'),
      statWarn: document.getElementById('statWarn'),
      statInfo: document.getElementById('statInfo'),
      statDebug: document.getElementById('statDebug'),

      // 버튼
      refreshBtn: document.getElementById('refreshBtn'),
      searchBtn: document.getElementById('searchBtn'),
      clearFiltersBtn: document.getElementById('clearFiltersBtn'),

      // 기타
      lastUpdate: document.getElementById('lastUpdate'),
      alertPanel: document.getElementById('alertPanel')
    };
  }

  /**
   * 이벤트 리스너 등록
   */
  attachEventListeners() {
    // 바인딩된 핸들러 함수들을 저장 (cleanup 시 제거하기 위해)
    this.handlers = {
      refreshData: () => this.refreshData(),
      searchInput: (e) => {
        this.state.filters.searchQuery = e.target.value;
        this.debouncedFilterLogs();
      },
      searchClick: () => this.filterLogs(),
      levelChange: (e) => {
        this.state.filters.level = e.target.value;
        this.filterLogs();
      },
      timeChange: (e) => {
        this.state.filters.timeRange = e.target.value;
        this.filterLogs();
      },
      clearFilters: () => this.clearFilters(),
      beforeUnload: () => this.cleanup()
    };

    // 디바운스된 필터링 함수 (300ms 대기)
    this.debouncedFilterLogs = debounce(() => this.filterLogs(), 300);

    // 이벤트 리스너 등록
    this.elements.refreshBtn?.addEventListener('click', this.handlers.refreshData);
    this.elements.logSearch?.addEventListener('input', this.handlers.searchInput);
    this.elements.searchBtn?.addEventListener('click', this.handlers.searchClick);
    this.elements.levelFilter?.addEventListener('change', this.handlers.levelChange);
    this.elements.timeFilter?.addEventListener('change', this.handlers.timeChange);
    this.elements.clearFiltersBtn?.addEventListener('click', this.handlers.clearFilters);
    window.addEventListener('beforeunload', this.handlers.beforeUnload);
  }

  /**
   * 초기 데이터 로드
   */
  async loadInitialData() {
    console.log('📊 초기 데이터 로드 중...');

    try {
      // 메트릭 데이터 로드
      const metrics = await fetchMetrics();
      this.updateMetrics(metrics);

      // 로그 데이터 로드
      const logs = await fetchLogs();
      this.updateLogs(logs);

      // 마지막 업데이트 시간 갱신
      this.state.lastUpdate = new Date();
      this.updateLastUpdateTime();

      console.log('✅ 데이터 로드 완료');
    } catch (error) {
      console.error('❌ 데이터 로드 실패:', error);
      throw error;
    }
  }

  /**
   * 데이터 새로고침
   */
  async refreshData() {
    console.log('🔄 데이터 새로고침...');

    try {
      await this.loadInitialData();
      this.showAlert('success', '새로고침 완료', '데이터가 업데이트되었습니다.');

      // 폴링이 중지된 상태라면 재시작
      if (!this.state.polling.isActive) {
        this.state.polling.errorCount = 0;
        this.startPolling();
        console.log('✅ 폴링 재시작됨');
      }
    } catch (error) {
      console.error('❌ 새로고침 실패:', error);
      this.showAlert('error', '새로고침 실패', '데이터를 업데이트할 수 없습니다.');
    }
  }

  /**
   * 메트릭 데이터 업데이트
   */
  updateMetrics(metrics) {
    if (!metrics || metrics.length === 0) return;

    // 가장 최근 메트릭 데이터 사용
    const latest = metrics[metrics.length - 1];
    this.state.metrics = latest;

    // CPU
    if (this.elements.cpuValue) {
      this.elements.cpuValue.textContent = formatNumber(latest.cpu, 1);
    }

    // 메모리
    if (this.elements.memoryValue) {
      this.elements.memoryValue.textContent = formatNumber(latest.memory.used, 0);
    }
    if (this.elements.memoryTotal) {
      this.elements.memoryTotal.textContent = formatNumber(latest.memory.total, 0);
    }

    // 디스크
    if (this.elements.diskValue) {
      this.elements.diskValue.textContent = formatNumber(latest.disk.used, 0);
    }
    if (this.elements.diskTotal) {
      this.elements.diskTotal.textContent = formatNumber(latest.disk.total, 0);
    }

    // 네트워크
    if (this.elements.networkIn) {
      this.elements.networkIn.textContent = formatNumber(latest.network.in, 1);
    }
    if (this.elements.networkOut) {
      this.elements.networkOut.textContent = formatNumber(latest.network.out, 1);
    }

    // TODO: 차트 업데이트 (Phase 2에서 구현)
    console.log('📊 메트릭 업데이트 완료:', latest);
  }

  /**
   * 로그 데이터 업데이트
   */
  updateLogs(logs) {
    this.state.logs = logs;
    this.renderLogs(logs);
    this.updateLogStats(logs);
  }

  /**
   * 로그 렌더링
   */
  renderLogs(logs) {
    const container = this.elements.logViewerContainer;
    if (!container) return;

    // 빈 상태 처리
    if (logs.length === 0) {
      container.innerHTML = '<div class="log-viewer__empty"><p>로그가 없습니다.</p></div>';
      return;
    }

    // 로그 HTML 생성
    const logsHTML = logs.map(log => this.createLogEntryHTML(log)).join('');
    container.innerHTML = logsHTML;
  }

  /**
   * 로그 항목 HTML 생성
   */
  createLogEntryHTML(log) {
    const timestamp = formatDate(new Date(log.timestamp), 'HH:mm:ss');
    const levelClass = `log-entry__level--${log.level.toLowerCase()}`;

    return `
      <div class="log-entry">
        <div class="log-entry__timestamp">${timestamp}</div>
        <div class="log-entry__level ${levelClass}">${log.level}</div>
        <div class="log-entry__message">${this.escapeHTML(log.message)}</div>
      </div>
    `;
  }

  /**
   * 로그 통계 업데이트
   */
  updateLogStats(logs) {
    const stats = {
      total: logs.length,
      ERROR: 0,
      WARN: 0,
      INFO: 0,
      DEBUG: 0
    };

    logs.forEach(log => {
      if (stats[log.level] !== undefined) {
        stats[log.level]++;
      }
    });

    if (this.elements.statTotal) this.elements.statTotal.textContent = stats.total;
    if (this.elements.statError) this.elements.statError.textContent = stats.ERROR;
    if (this.elements.statWarn) this.elements.statWarn.textContent = stats.WARN;
    if (this.elements.statInfo) this.elements.statInfo.textContent = stats.INFO;
    if (this.elements.statDebug) this.elements.statDebug.textContent = stats.DEBUG;
  }

  /**
   * 로그 필터링
   */
  filterLogs() {
    let filteredLogs = [...this.state.logs];

    // 레벨 필터
    if (this.state.filters.level !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === this.state.filters.level);
    }

    // 검색 필터
    if (this.state.filters.searchQuery) {
      const query = this.state.filters.searchQuery.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(query)
      );
    }

    // TODO: 시간 범위 필터 (Phase 3에서 구현)

    this.renderLogs(filteredLogs);
    this.updateLogStats(filteredLogs);
  }

  /**
   * 필터 초기화
   */
  clearFilters() {
    this.state.filters = {
      level: 'all',
      timeRange: 'all',
      searchQuery: ''
    };

    if (this.elements.logSearch) this.elements.logSearch.value = '';
    if (this.elements.levelFilter) this.elements.levelFilter.value = 'all';
    if (this.elements.timeFilter) this.elements.timeFilter.value = 'all';

    this.filterLogs();
  }

  /**
   * 폴링 시작
   */
  startPolling() {
    if (this.state.polling.isActive) return;

    console.log(`⏱️ 폴링 시작 (${this.state.polling.interval}ms 간격)`);

    this.state.polling.timerId = setInterval(async () => {
      try {
        await this.loadInitialData();
        // 성공 시 에러 카운터 리셋
        this.state.polling.errorCount = 0;
      } catch (error) {
        console.error('폴링 중 오류:', error);
        this.state.polling.errorCount++;

        // 연속 에러 횟수가 최대치를 초과하면 폴링 중지
        if (this.state.polling.errorCount >= this.state.polling.maxErrors) {
          this.stopPolling();
          this.showAlert(
            'error',
            '자동 갱신 중단',
            `연속 ${this.state.polling.maxErrors}회 오류로 데이터 갱신이 중단되었습니다. 새로고침 버튼을 눌러 다시 시도하세요.`
          );
          console.error(`❌ 폴링 중단: ${this.state.polling.errorCount}회 연속 실패`);
        }
      }
    }, this.state.polling.interval);

    this.state.polling.isActive = true;
  }

  /**
   * 폴링 중지
   */
  stopPolling() {
    if (this.state.polling.timerId) {
      clearInterval(this.state.polling.timerId);
      this.state.polling.timerId = null;
      this.state.polling.isActive = false;
      console.log('⏹️ 폴링 중지');
    }
  }

  /**
   * 마지막 업데이트 시간 표시
   */
  updateLastUpdateTime() {
    if (!this.elements.lastUpdate || !this.state.lastUpdate) return;

    const timeStr = formatDate(this.state.lastUpdate, 'HH:mm:ss');
    this.elements.lastUpdate.textContent = `마지막 업데이트: ${timeStr}`;
  }

  /**
   * 알림 표시
   */
  showAlert(type, title, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert--${type}`;
    alert.innerHTML = `
      <div class="alert__title">${this.escapeHTML(title)}</div>
      <div class="alert__message">${this.escapeHTML(message)}</div>
    `;

    this.elements.alertPanel?.appendChild(alert);

    // config에서 지정한 시간 후 자동 제거
    setTimeout(() => {
      alert.remove();
    }, config.alert.duration);
  }

  /**
   * HTML 이스케이프 (XSS 방지)
   */
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * 정리 (메모리 누수 방지)
   */
  cleanup() {
    console.log('🧹 정리 작업 수행 중...');

    // 폴링 중지
    this.stopPolling();

    // 이벤트 리스너 제거
    if (this.handlers) {
      this.elements.refreshBtn?.removeEventListener('click', this.handlers.refreshData);
      this.elements.logSearch?.removeEventListener('input', this.handlers.searchInput);
      this.elements.searchBtn?.removeEventListener('click', this.handlers.searchClick);
      this.elements.levelFilter?.removeEventListener('change', this.handlers.levelChange);
      this.elements.timeFilter?.removeEventListener('change', this.handlers.timeChange);
      this.elements.clearFiltersBtn?.removeEventListener('click', this.handlers.clearFilters);
      window.removeEventListener('beforeunload', this.handlers.beforeUnload);
    }

    console.log('✅ 정리 완료');
  }
}

// 애플리케이션 시작
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
