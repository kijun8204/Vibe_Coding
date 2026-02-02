/**
 * MetricsCard 컴포넌트
 * 개별 메트릭 카드 렌더링 및 상태 관리
 */

import { formatNumber, calculatePercentage } from '../utils.js';

export class MetricsCard {
  constructor(element, config = {}) {
    this.element = element;
    this.config = {
      type: config.type || 'cpu', // cpu, memory, disk, network
      label: config.label || 'Metric',
      icon: config.icon || '📊',
      unit: config.unit || '%',
      threshold: config.threshold || { warning: 70, critical: 90 },
      ...config
    };

    this.state = {
      currentValue: 0,
      maxValue: 100,
      status: 'normal', // normal, warning, critical
      history: []
    };

    this.elements = {};
    this.init();
  }

  /**
   * 초기화
   */
  init() {
    if (!this.element) {
      console.error('MetricsCard element not found');
      return;
    }

    // DOM 요소 참조 저장
    this.cacheElements();

    console.log(`✅ MetricsCard 초기화: ${this.config.type}`);
  }

  /**
   * DOM 요소 캐싱
   */
  cacheElements() {
    this.elements = {
      value: this.element.querySelector('.value'),
      unit: this.element.querySelector('.unit'),
      status: this.element.querySelector('.metric-card__status'),
      chart: this.element.querySelector('.metric-card__chart'),
      info: this.element.querySelector('.metric-card__info')
    };
  }

  /**
   * 메트릭 데이터 업데이트
   * @param {Object} data - 메트릭 데이터
   */
  update(data) {
    if (!data) return;

    // 타입에 따라 값 추출
    let value = 0;
    let maxValue = 100;

    switch (this.config.type) {
      case 'cpu':
        value = data.cpu || 0;
        break;
      case 'memory':
        value = data.memory?.used || 0;
        maxValue = data.memory?.total || 100;
        break;
      case 'disk':
        value = data.disk?.used || 0;
        maxValue = data.disk?.total || 100;
        break;
      case 'network':
        // 네트워크는 특별 처리 (in/out 표시)
        this.updateNetwork(data.network);
        return;
      default:
        console.warn(`Unknown metric type: ${this.config.type}`);
        return;
    }

    // 상태 업데이트
    this.state.currentValue = value;
    this.state.maxValue = maxValue;
    this.state.history.push(value);

    // 히스토리 크기 제한 (최대 50개)
    if (this.state.history.length > 50) {
      this.state.history.shift();
    }

    // 상태 결정 (퍼센트 기준)
    const percentage = calculatePercentage(value, maxValue);
    this.updateStatus(percentage);

    // UI 업데이트
    this.render();
  }

  /**
   * 네트워크 메트릭 업데이트
   * @param {Object} network - 네트워크 데이터
   */
  updateNetwork(network) {
    if (!network) return;

    const inElement = this.element.querySelector('#networkIn');
    const outElement = this.element.querySelector('#networkOut');

    if (inElement) {
      inElement.textContent = formatNumber(network.in || 0, 1);
    }

    if (outElement) {
      outElement.textContent = formatNumber(network.out || 0, 1);
    }

    // 상태 업데이트 (네트워크는 임계값 없음)
    this.state.status = 'normal';
    this.updateStatusUI();
  }

  /**
   * 상태 결정 및 업데이트
   * @param {number} percentage - 사용률 퍼센트
   */
  updateStatus(percentage) {
    const { warning, critical } = this.config.threshold;

    if (percentage >= critical) {
      this.state.status = 'critical';
    } else if (percentage >= warning) {
      this.state.status = 'warning';
    } else {
      this.state.status = 'normal';
    }
  }

  /**
   * 렌더링
   */
  render() {
    this.updateValueUI();
    this.updateStatusUI();
    // TODO: Phase 2에서 차트 렌더링 구현
  }

  /**
   * 값 UI 업데이트
   */
  updateValueUI() {
    if (this.elements.value) {
      const displayValue = this.config.type === 'cpu'
        ? formatNumber(this.state.currentValue, 1)
        : formatNumber(this.state.currentValue, 0);

      this.elements.value.textContent = displayValue;
    }

    // 메모리, 디스크는 total 정보도 표시
    if (this.elements.info && (this.config.type === 'memory' || this.config.type === 'disk')) {
      const totalElement = this.element.querySelector(`#${this.config.type}Total`);
      if (totalElement) {
        totalElement.textContent = formatNumber(this.state.maxValue, 0);
      }
    }
  }

  /**
   * 상태 UI 업데이트
   */
  updateStatusUI() {
    if (!this.elements.status) return;

    const statusText = {
      normal: '정상',
      warning: '경고',
      critical: '위험'
    };

    this.elements.status.textContent = statusText[this.state.status] || '정상';
    this.elements.status.setAttribute('data-status', this.state.status);
  }

  /**
   * 현재 값 가져오기
   * @returns {number} 현재 값
   */
  getValue() {
    return this.state.currentValue;
  }

  /**
   * 상태 가져오기
   * @returns {string} 현재 상태
   */
  getStatus() {
    return this.state.status;
  }

  /**
   * 히스토리 가져오기
   * @returns {Array<number>} 값 히스토리
   */
  getHistory() {
    return [...this.state.history];
  }

  /**
   * 정리
   */
  destroy() {
    this.state.history = [];
    console.log(`🧹 MetricsCard 정리: ${this.config.type}`);
  }
}
