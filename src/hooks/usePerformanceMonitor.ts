import { useState, useEffect, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  webVitals: {
    LCP: number | null;  // Largest Contentful Paint
    FID: number | null;  // First Input Delay  
    CLS: number | null;  // Cumulative Layout Shift
    TTFB: number | null; // Time to First Byte
    FCP: number | null;  // First Contentful Paint
  };
  resourceTiming: {
    totalResources: number;
    cachedResources: number;
    totalSize: number;
    totalDuration: number;
    slowestResource: string | null;
    averageDuration: number;
  };
  navigationTiming: {
    pageLoadTime: number;
    domContentLoaded: number;
    domInteractive: number;
    redirectTime: number;
    dnsTime: number;
    connectionTime: number;
    requestTime: number;
    responseTime: number;
  };
  memoryUsage: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  errors: Array<{
    timestamp: number;
    message: string;
    source?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
  }>;
}

export interface PerformanceThresholds {
  LCP?: number;   // < 2.5s good, < 4s needs improvement
  FID?: number;   // < 100ms good, < 300ms needs improvement
  CLS?: number;   // < 0.1 good, < 0.25 needs improvement
  TTFB?: number;  // < 800ms good, < 1800ms needs improvement
  FCP?: number;   // < 1.8s good, < 3s needs improvement
}

export interface UsePerformanceMonitorOptions {
  enableMonitoring?: boolean;
  thresholds?: PerformanceThresholds;
  sampleRate?: number; // 0-1, percentage of users to monitor
  reportToAnalytics?: (metrics: PerformanceMetrics) => void;
  onThresholdExceeded?: (metric: string, value: number, threshold: number) => void;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const {
    enableMonitoring = true,
    thresholds = {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      TTFB: 800,
      FCP: 1800
    },
    sampleRate = 1.0,
    reportToAnalytics,
    onThresholdExceeded,
    onMetricsUpdate
  } = options;

  const observersRef = useRef<{
    lcp?: PerformanceObserver;
    fid?: PerformanceObserver;
    cls?: PerformanceObserver;
  }>({});

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    webVitals: {
      LCP: null,
      FID: null,
      CLS: null,
      TTFB: null,
      FCP: null
    },
    resourceTiming: {
      totalResources: 0,
      cachedResources: 0,
      totalSize: 0,
      totalDuration: 0,
      slowestResource: null,
      averageDuration: 0
    },
    navigationTiming: {
      pageLoadTime: 0,
      domContentLoaded: 0,
      domInteractive: 0,
      redirectTime: 0,
      dnsTime: 0,
      connectionTime: 0,
      requestTime: 0,
      responseTime: 0
    },
    memoryUsage: null,
    errors: []
  });

  // 샘플링 체크
  const shouldSample = useCallback(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);

  // 리소스 타이밍 측정 - 의존성 최소화
  const measureResourceTiming = useCallback(() => {
    if (!enableMonitoring) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let totalSize = 0;
    let totalDuration = 0;
    let cachedCount = 0;
    let slowest = { name: '', duration: 0 };

    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime;
      totalDuration += duration;
      
      if (resource.transferSize === 0) {
        cachedCount++;
      }
      totalSize += resource.transferSize || 0;

      if (duration > slowest.duration) {
        slowest = { name: resource.name, duration };
      }
    });

    setMetrics(prev => ({
      ...prev,
      resourceTiming: {
        totalResources: resources.length,
        cachedResources: cachedCount,
        totalSize,
        totalDuration,
        slowestResource: slowest.name,
        averageDuration: resources.length ? totalDuration / resources.length : 0
      }
    }));
  }, [enableMonitoring]);

  // 네비게이션 타이밍 측정 - 의존성 최소화
  const measureNavigationTiming = useCallback(() => {
    if (!enableMonitoring) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    setMetrics(prev => ({
      ...prev,
      navigationTiming: {
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        redirectTime: navigation.redirectEnd - navigation.redirectStart,
        dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
        connectionTime: navigation.connectEnd - navigation.connectStart,
        requestTime: navigation.responseStart - navigation.requestStart,
        responseTime: navigation.responseEnd - navigation.responseStart
      },
      webVitals: {
        ...prev.webVitals,
        TTFB: navigation.responseStart - navigation.requestStart
      }
    }));
  }, [enableMonitoring]);

  // 메모리 사용량 측정 - 의존성 최소화
  const measureMemoryUsage = useCallback(() => {
    if (!enableMonitoring) return;

    const memory = (performance as any).memory;
    if (memory) {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        }
      }));
    }
  }, [enableMonitoring]);

  // 에러 추적
  const trackError = useCallback((error: {
    timestamp: number;
    message: string;
    source?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
  }) => {
    if (!enableMonitoring) return;

    setMetrics(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-9), error] // 최대 10개 에러 유지
    }));
  }, [enableMonitoring]);

  // Web Vitals Observer 설정 (한 번만)
  useEffect(() => {
    if (!enableMonitoring || !shouldSample()) return;

    let clsValue = 0;

    // LCP Observer
    if (!observersRef.current.lcp) {
      try {
        observersRef.current.lcp = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          const lcp = lastEntry.renderTime || lastEntry.loadTime;
          
          setMetrics(prev => ({
            ...prev,
            webVitals: { ...prev.webVitals, LCP: lcp }
          }));

          if (thresholds.LCP && lcp > thresholds.LCP) {
            onThresholdExceeded?.('LCP', lcp, thresholds.LCP);
          }
        });
        observersRef.current.lcp.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    }

    // FID Observer
    if (!observersRef.current.fid) {
      try {
        observersRef.current.fid = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstInput = entries[0] as any;
          const fid = firstInput.processingStart - firstInput.startTime;
          
          setMetrics(prev => ({
            ...prev,
            webVitals: { ...prev.webVitals, FID: fid }
          }));

          if (thresholds.FID && fid > thresholds.FID) {
            onThresholdExceeded?.('FID', fid, thresholds.FID);
          }
        });
        observersRef.current.fid.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }
    }

    // CLS Observer
    if (!observersRef.current.cls) {
      try {
        observersRef.current.cls = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          
          setMetrics(prev => ({
            ...prev,
            webVitals: { ...prev.webVitals, CLS: clsValue }
          }));

          if (thresholds.CLS && clsValue > thresholds.CLS) {
            onThresholdExceeded?.('CLS', clsValue, thresholds.CLS);
          }
        });
        observersRef.current.cls.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    }

    return () => {
      // Cleanup observers
      observersRef.current.lcp?.disconnect();
      observersRef.current.fid?.disconnect();
      observersRef.current.cls?.disconnect();
      observersRef.current = {};
    };
  }, [enableMonitoring]); // 의존성을 최소화

  // 초기 측정 - 함수 직접 호출로 의존성 제거
  useEffect(() => {
    if (!enableMonitoring) return;

    // 페이지 로드 완료 후 측정
    const handleLoad = () => {
      // 직접 측정 로직 실행 (함수 참조 대신)
      if (!enableMonitoring) return;
      
      // 리소스 타이밍
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let totalSize = 0;
      let totalDuration = 0;
      let cachedCount = 0;
      let slowest = { name: '', duration: 0 };

      resources.forEach(resource => {
        const duration = resource.responseEnd - resource.startTime;
        totalDuration += duration;
        if (resource.transferSize === 0) cachedCount++;
        totalSize += resource.transferSize || 0;
        if (duration > slowest.duration) {
          slowest = { name: resource.name, duration };
        }
      });

      // 네비게이션 타이밍
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      setMetrics(prev => ({
        ...prev,
        resourceTiming: {
          totalResources: resources.length,
          cachedResources: cachedCount,
          totalSize,
          totalDuration,
          slowestResource: slowest.name,
          averageDuration: resources.length ? totalDuration / resources.length : 0
        },
        navigationTiming: navigation ? {
          pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
          redirectTime: navigation.redirectEnd - navigation.redirectStart,
          dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
          connectionTime: navigation.connectEnd - navigation.connectStart,
          requestTime: navigation.responseStart - navigation.requestStart,
          responseTime: navigation.responseEnd - navigation.responseStart
        } : prev.navigationTiming,
        webVitals: navigation ? {
          ...prev.webVitals,
          TTFB: navigation.responseStart - navigation.requestStart
        } : prev.webVitals
      }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // 에러 리스너
    const errorHandler = (event: ErrorEvent) => {
      if (!enableMonitoring) return;
      setMetrics(prev => ({
        ...prev,
        errors: [...prev.errors.slice(-9), {
          timestamp: Date.now(),
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }]
      }));
    };

    window.addEventListener('error', errorHandler);

    // 주기적 메모리 측정 (1분마다)
    const memoryInterval = setInterval(() => {
      if (!enableMonitoring) return;
      const memory = (performance as any).memory;
      if (memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
          }
        }));
      }
    }, 60000);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('error', errorHandler);
      clearInterval(memoryInterval);
    };
  }, [enableMonitoring]); // 함수 의존성 제거

  // 메트릭 업데이트 알림
  useEffect(() => {
    if (onMetricsUpdate && metrics) {
      onMetricsUpdate(metrics);
    }
  }, [metrics]); // onMetricsUpdate를 의존성에서 제외하여 무한 루프 방지

  // Analytics 리포팅
  useEffect(() => {
    if (!reportToAnalytics || !enableMonitoring) return;

    const reportInterval = setInterval(() => {
      reportToAnalytics(metrics);
    }, 30000); // 30초마다 리포트

    return () => clearInterval(reportInterval);
  }, [metrics, reportToAnalytics, enableMonitoring]);

  // 수동 측정 트리거 - 직접 로직 실행
  const measureNow = useCallback(() => {
    if (!enableMonitoring) return;
    
    // 리소스 타이밍
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    let totalDuration = 0;
    let cachedCount = 0;
    let slowest = { name: '', duration: 0 };

    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime;
      totalDuration += duration;
      if (resource.transferSize === 0) cachedCount++;
      totalSize += resource.transferSize || 0;
      if (duration > slowest.duration) {
        slowest = { name: resource.name, duration };
      }
    });

    // 네비게이션 타이밍
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // 메모리
    const memory = (performance as any).memory;
    
    setMetrics(prev => ({
      ...prev,
      resourceTiming: {
        totalResources: resources.length,
        cachedResources: cachedCount,
        totalSize,
        totalDuration,
        slowestResource: slowest.name,
        averageDuration: resources.length ? totalDuration / resources.length : 0
      },
      navigationTiming: navigation ? {
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        redirectTime: navigation.redirectEnd - navigation.redirectStart,
        dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
        connectionTime: navigation.connectEnd - navigation.connectStart,
        requestTime: navigation.responseStart - navigation.requestStart,
        responseTime: navigation.responseEnd - navigation.responseStart
      } : prev.navigationTiming,
      webVitals: navigation ? {
        ...prev.webVitals,
        TTFB: navigation.responseStart - navigation.requestStart
      } : prev.webVitals,
      memoryUsage: memory ? {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      } : prev.memoryUsage
    }));
  }, [enableMonitoring]);

  // 에러 클리어
  const clearErrors = useCallback(() => {
    setMetrics(prev => ({ ...prev, errors: [] }));
  }, []);

  // 메트릭 리셋
  const reset = useCallback(() => {
    setMetrics({
      webVitals: {
        LCP: null,
        FID: null,
        CLS: null,
        TTFB: null,
        FCP: null
      },
      resourceTiming: {
        totalResources: 0,
        cachedResources: 0,
        totalSize: 0,
        totalDuration: 0,
        slowestResource: null,
        averageDuration: 0
      },
      navigationTiming: {
        pageLoadTime: 0,
        domContentLoaded: 0,
        domInteractive: 0,
        redirectTime: 0,
        dnsTime: 0,
        connectionTime: 0,
        requestTime: 0,
        responseTime: 0
      },
      memoryUsage: null,
      errors: []
    });
  }, []);

  return {
    metrics,
    measureNow,
    clearErrors,
    reset,
    isMonitoring: enableMonitoring
  };
}