'use client';

import { useEffect, useState } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';

interface PerformanceMonitorProps {
  showDetails?: boolean;
  compact?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function PerformanceMonitor({ 
  showDetails = false, 
  compact = true,
  position = 'bottom-right' 
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { metrics, measureNow } = usePerformanceMonitor({
    enableMonitoring: true,
    thresholds: {
      LCP: 2000,  // CLS/LCP 최적화 후 더 엄격한 임계값
      FID: 100,
      CLS: 0.05,  // 디자인 시스템 최적화로 더 엄격하게
      TTFB: 600   // Next.js 14 App Router 성능 개선 고려
    },
    onThresholdExceeded: (metric, value, threshold) => {
      console.warn(`Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${threshold}ms)`);
    }
  });

  // 개발 환경에서만 표시
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const getMetricStatus = (value: number | null, threshold: number) => {
    if (value === null) return 'pending';
    if (value <= threshold) return 'good';
    if (value <= threshold * 1.5) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (compact) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <Card className="p-2 bg-white/90 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="font-medium">LCP:</span>
              <span className={getStatusColor(getMetricStatus(metrics.webVitals.LCP, 2000))}>
                {metrics.webVitals.LCP ? `${Math.round(metrics.webVitals.LCP)}ms` : '...'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">FID:</span>
              <span className={getStatusColor(getMetricStatus(metrics.webVitals.FID, 100))}>
                {metrics.webVitals.FID ? `${Math.round(metrics.webVitals.FID)}ms` : '...'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">CLS:</span>
              <span className={getStatusColor(getMetricStatus(metrics.webVitals.CLS, 0.05))}>
                {metrics.webVitals.CLS ? metrics.webVitals.CLS.toFixed(3) : '...'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 w-80`}>
      <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <Typography variant="h6" className="text-sm font-semibold">
            Performance Monitor
          </Typography>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* Core Web Vitals */}
          <div>
            <Typography variant="body2" className="text-xs font-medium text-gray-600 mb-2">
              Core Web Vitals
            </Typography>
            <div className="space-y-2">
              <MetricRow
                label="LCP"
                value={metrics.webVitals.LCP}
                unit="ms"
                threshold={2000}
                description="Largest Contentful Paint"
              />
              <MetricRow
                label="FID"
                value={metrics.webVitals.FID}
                unit="ms"
                threshold={100}
                description="First Input Delay"
              />
              <MetricRow
                label="CLS"
                value={metrics.webVitals.CLS}
                unit=""
                threshold={0.05}
                format={(v) => v.toFixed(3)}
                description="Cumulative Layout Shift"
              />
              <MetricRow
                label="TTFB"
                value={metrics.webVitals.TTFB}
                unit="ms"
                threshold={600}
                description="Time to First Byte"
              />
            </div>
          </div>

          {showDetails && (
            <>
              {/* Navigation Timing */}
              <div>
                <Typography variant="body2" className="text-xs font-medium text-gray-600 mb-2">
                  Page Load Timing
                </Typography>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">DOM Content Loaded:</span>
                    <span className="font-mono">{Math.round(metrics.navigationTiming.domContentLoaded)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Page Load Complete:</span>
                    <span className="font-mono">{Math.round(metrics.navigationTiming.pageLoadTime)}ms</span>
                  </div>
                </div>
              </div>

              {/* Memory Usage */}
              {metrics.memoryUsage && (
                <div>
                  <Typography variant="body2" className="text-xs font-medium text-gray-600 mb-2">
                    Memory Usage
                  </Typography>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">JS Heap:</span>
                      <span className="font-mono">
                        {(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB / 
                        {(metrics.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(1)}MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Usage:</span>
                      <span className={`font-mono ${
                        (metrics.memoryUsage.usedJSHeapSize / metrics.memoryUsage.totalJSHeapSize * 100) > 90 ? 'text-red-600' : 
                        (metrics.memoryUsage.usedJSHeapSize / metrics.memoryUsage.totalJSHeapSize * 100) > 70 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {((metrics.memoryUsage.usedJSHeapSize / metrics.memoryUsage.totalJSHeapSize) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 pt-2 border-t">
            <button
              onClick={measureNow}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: number | null;
  unit: string;
  threshold: number;
  description?: string;
  format?: (value: number) => string;
}

function MetricRow({ label, value, unit, threshold, description, format }: MetricRowProps) {
  const status = value === null ? 'pending' : 
    value <= threshold ? 'good' : 
    value <= threshold * 1.5 ? 'needs-improvement' : 
    'poor';

  const statusColors = {
    good: 'bg-green-100 text-green-800',
    'needs-improvement': 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-400'
  };

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className="font-medium">{label}</span>
        {description && (
          <span className="text-gray-400 text-[10px]">{description}</span>
        )}
      </div>
      <span className={`px-2 py-0.5 rounded-full font-mono ${statusColors[status]}`}>
        {value !== null ? 
          `${format ? format(value) : Math.round(value)}${unit}` : 
          'Measuring...'
        }
      </span>
    </div>
  );
}