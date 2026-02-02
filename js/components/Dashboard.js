/**
 * Dashboard 컴포넌트
 * 메인 대시보드 레이아웃 및 컴포넌트 조정
 */

export class Dashboard {
  constructor(container) {
    this.container = container;
    this.components = new Map();
    this.state = {
      isLoading: false,
      error: null
    };
  }

  /**
   * 컴포넌트 등록
   * @param {string} name - 컴포넌트 이름
   * @param {Object} component - 컴포넌트 인스턴스
   */
  registerComponent(name, component) {
    this.components.set(name, component);
    console.log(`✅ 컴포넌트 등록: ${name}`);
  }

  /**
   * 컴포넌트 가져오기
   * @param {string} name - 컴포넌트 이름
   * @returns {Object|null} 컴포넌트 인스턴스
   */
  getComponent(name) {
    return this.components.get(name) || null;
  }

  /**
   * 대시보드 렌더링
   */
  render() {
    if (!this.container) {
      console.error('Dashboard container not found');
      return;
    }

    console.log('📊 Dashboard 렌더링');

    // 모든 등록된 컴포넌트 렌더링
    for (const [name, component] of this.components) {
      if (typeof component.render === 'function') {
        try {
          component.render();
        } catch (error) {
          console.error(`컴포넌트 렌더링 실패 (${name}):`, error);
        }
      }
    }
  }

  /**
   * 대시보드 업데이트
   * @param {Object} data - 업데이트할 데이터
   */
  update(data) {
    console.log('🔄 Dashboard 업데이트', data);

    // 메트릭 데이터 업데이트
    if (data.metrics) {
      const metricsCard = this.getComponent('metricsCard');
      if (metricsCard && typeof metricsCard.update === 'function') {
        metricsCard.update(data.metrics);
      }
    }

    // 로그 데이터 업데이트
    if (data.logs) {
      const logViewer = this.getComponent('logViewer');
      if (logViewer && typeof logViewer.update === 'function') {
        logViewer.update(data.logs);
      }
    }
  }

  /**
   * 로딩 상태 설정
   * @param {boolean} isLoading - 로딩 여부
   */
  setLoading(isLoading) {
    this.state.isLoading = isLoading;

    if (isLoading) {
      this.showLoadingState();
    } else {
      this.hideLoadingState();
    }
  }

  /**
   * 로딩 상태 표시
   */
  showLoadingState() {
    console.log('⏳ 로딩 중...');
    // TODO: 로딩 스피너 표시
  }

  /**
   * 로딩 상태 숨김
   */
  hideLoadingState() {
    console.log('✅ 로딩 완료');
    // TODO: 로딩 스피너 숨김
  }

  /**
   * 에러 표시
   * @param {Error|string} error - 에러 객체 또는 메시지
   */
  showError(error) {
    this.state.error = error;
    const message = error instanceof Error ? error.message : error;
    console.error('❌ Dashboard 에러:', message);
    // TODO: 에러 UI 표시
  }

  /**
   * 대시보드 정리
   */
  destroy() {
    console.log('🧹 Dashboard 정리');

    // 모든 컴포넌트 정리
    for (const [name, component] of this.components) {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    }

    this.components.clear();
  }
}
