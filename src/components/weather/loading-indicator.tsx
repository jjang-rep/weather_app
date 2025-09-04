'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  onRetry?: () => void;
  message?: string;
}

export function LoadingIndicator({ 
  isLoading, 
  error, 
  retryCount, 
  onRetry,
  message = '날씨 데이터를 가져오는 중...'
}: LoadingIndicatorProps) {
  if (!isLoading && !error) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* 로딩 상태 */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              {/* 스피너 애니메이션 */}
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-primary animate-pulse" />
                </div>
              </div>
              
              {/* 로딩 메시지 */}
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">{message}</p>
                {retryCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    재시도 중... ({retryCount}/3)
                  </p>
                )}
              </div>
              
              {/* 프로그레스 바 */}
              <div className="w-full max-w-xs">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{
                    width: '100%',
                    animation: 'loading-bar 2s ease-in-out infinite'
                  }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 에러 상태 */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              <span className="font-medium">데이터 로딩 실패</span>
            </div>
            <p>{error}</p>
            {onRetry && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Wifi className="h-4 w-4" />
                  다시 시도
                </Button>
                {retryCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    (재시도 {retryCount}/3)
                  </span>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
