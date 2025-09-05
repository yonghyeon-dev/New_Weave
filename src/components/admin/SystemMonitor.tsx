'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { 
  Server, 
  Database, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  Wifi,
  Shield
} from 'lucide-react';

interface SystemStatus {
  service: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  lastCheck: string;
  details?: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: 'connected' | 'disconnected';
}

export function SystemMonitor() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      service: 'Next.js Server',
      status: 'healthy',
      uptime: '2h 15m',
      lastCheck: '방금 전'
    },
    {
      service: 'Database',
      status: 'healthy',
      uptime: '24h 5m',
      lastCheck: '30초 전'
    },
    {
      service: 'API Gateway',
      status: 'warning',
      uptime: '1h 45m',
      lastCheck: '1분 전',
      details: '응답 시간이 평소보다 느림'
    },
    {
      service: 'File Storage',
      status: 'healthy',
      uptime: '72h 12m',
      lastCheck: '2분 전'
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 'connected'
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 시뮬레이션된 실시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        disk: prev.disk + (Math.random() - 0.5) * 0.1,
        network: Math.random() > 0.1 ? 'connected' : 'disconnected'
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 시뮬레이션된 새로고침
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSystemStatus(prev => prev.map(status => ({
      ...status,
      lastCheck: '방금 전',
      status: Math.random() > 0.2 ? 'healthy' : 'warning' as any
    })));
    
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 60) return 'text-green-600 bg-green-100';
    if (value < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* 시스템 개요 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <Typography variant="body2" className="text-txt-secondary">
                CPU 사용률
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="h4" className={`${getMetricColor(metrics.cpu).split(' ')[0]}`}>
                  {Math.round(metrics.cpu)}%
                </Typography>
                <div className={`px-2 py-1 rounded-full text-xs ${getMetricColor(metrics.cpu)}`}>
                  {metrics.cpu > 80 ? '높음' : metrics.cpu > 60 ? '보통' : '낮음'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <Typography variant="body2" className="text-txt-secondary">
                메모리 사용률
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="h4" className={`${getMetricColor(metrics.memory).split(' ')[0]}`}>
                  {Math.round(metrics.memory)}%
                </Typography>
                <div className={`px-2 py-1 rounded-full text-xs ${getMetricColor(metrics.memory)}`}>
                  {metrics.memory > 80 ? '높음' : metrics.memory > 60 ? '보통' : '낮음'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <HardDrive className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <Typography variant="body2" className="text-txt-secondary">
                디스크 사용률
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="h4" className={`${getMetricColor(metrics.disk).split(' ')[0]}`}>
                  {Math.round(metrics.disk)}%
                </Typography>
                <div className={`px-2 py-1 rounded-full text-xs ${getMetricColor(metrics.disk)}`}>
                  {metrics.disk > 80 ? '높음' : metrics.disk > 60 ? '보통' : '낮음'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wifi className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <Typography variant="body2" className="text-txt-secondary">
                네트워크 상태
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="h4" className={metrics.network === 'connected' ? 'text-green-600' : 'text-red-600'}>
                  {metrics.network === 'connected' ? '연결됨' : '끊어짐'}
                </Typography>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  metrics.network === 'connected' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {metrics.network === 'connected' ? '정상' : '오류'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 서비스 상태 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h3" className="text-lg font-semibold text-txt-primary">
            서비스 상태
          </Typography>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? '새로고침 중...' : '새로고침'}
          </Button>
        </div>

        <div className="space-y-3">
          {systemStatus.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <Typography variant="h4" className="font-medium text-txt-primary">
                    {service.service}
                  </Typography>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status === 'healthy' ? '정상' : 
                   service.status === 'warning' ? '경고' : '오류'}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-4 text-sm text-txt-secondary">
                  <span>업타임: {service.uptime}</span>
                  <span>마지막 확인: {service.lastCheck}</span>
                </div>
                {service.details && (
                  <Typography variant="body2" className="text-yellow-600 mt-1">
                    {service.details}
                  </Typography>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 시스템 작업 */}
      <Card className="p-6">
        <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-4">
          시스템 작업
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto p-4 flex-col items-start">
            <div className="flex items-center gap-2 w-full mb-2">
              <Server className="w-5 h-5 text-blue-600" />
              <Typography variant="h4" className="font-medium">
                서버 재시작
              </Typography>
            </div>
            <Typography variant="body2" className="text-txt-secondary text-left">
              모든 서비스를 안전하게 재시작합니다
            </Typography>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex-col items-start">
            <div className="flex items-center gap-2 w-full mb-2">
              <Database className="w-5 h-5 text-green-600" />
              <Typography variant="h4" className="font-medium">
                DB 최적화
              </Typography>
            </div>
            <Typography variant="body2" className="text-txt-secondary text-left">
              데이터베이스 인덱스를 재구성합니다
            </Typography>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex-col items-start">
            <div className="flex items-center gap-2 w-full mb-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <Typography variant="h4" className="font-medium">
                보안 스캔
              </Typography>
            </div>
            <Typography variant="body2" className="text-txt-secondary text-left">
              시스템 보안 취약점을 검사합니다
            </Typography>
          </Button>
        </div>
      </Card>
    </div>
  );
}