'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useWeather } from '@/contexts/weather-context';
import { RefreshCw, Clock, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RefreshControlsProps {
  onManualRefresh: () => void;
  isRefreshing?: boolean;
}

export function RefreshControls({ onManualRefresh, isRefreshing = false }: RefreshControlsProps) {
  const { 
    isAutoRefreshEnabled, 
    toggleAutoRefresh, 
    lastUpdated 
  } = useWeather();

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '아직 업데이트되지 않음';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 수동 새로고침 버튼 */}
          <Button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw 
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
            {isRefreshing ? '새로고침 중...' : '수동 새로고침'}
          </Button>

          {/* 자동 새로고침 설정 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">자동 새로고침 (30분)</span>
            </div>
            <Switch
              checked={isAutoRefreshEnabled}
              onCheckedChange={toggleAutoRefresh}
              aria-label="자동 새로고침 토글"
            />
          </div>

          {/* 마지막 업데이트 시간 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span>마지막 업데이트: {formatLastUpdated(lastUpdated)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
