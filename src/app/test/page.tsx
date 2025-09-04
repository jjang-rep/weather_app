'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { testUtilityFunctions, testWeatherAPI } from '@/lib/test-api';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const results: string[] = [];
    
    // 1. 환경 변수 테스트
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;
    
    results.push(`🔧 환경 변수 테스트:`);
    results.push(`   API Key: ${apiKey ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
    results.push(`   Base URL: ${baseUrl || '❌ 설정되지 않음'}`);
    
    // 2. 유틸리티 함수 테스트
    try {
      testUtilityFunctions();
      results.push(`✅ 유틸리티 함수 테스트: 성공`);
    } catch (error) {
      results.push(`❌ 유틸리티 함수 테스트: 실패 - ${error}`);
    }
    
    // 3. 컴포넌트 import 테스트
    try {
      await import('@/components/ui/button');
      await import('@/components/ui/input');
      await import('@/components/ui/card');
      results.push(`✅ shadcn/ui 컴포넌트 import: 성공`);
    } catch (error) {
      results.push(`❌ shadcn/ui 컴포넌트 import: 실패 - ${error}`);
    }
    
    // 4. API 함수 import 테스트
    try {
      await import('@/lib/weather-api');
      results.push(`✅ Weather API 함수 import: 성공`);
    } catch (error) {
      results.push(`❌ Weather API 함수 import: 실패 - ${error}`);
    }
    
    // 5. 실제 API 테스트 (API 키가 설정된 경우)
    if (apiKey) {
      try {
        results.push(`🌤️ 실제 API 테스트 시작...`);
        const apiTestResult = await testWeatherAPI();
        results.push(`✅ 실제 API 테스트: ${apiTestResult ? '성공' : '실패'}`);
      } catch (error) {
        results.push(`❌ 실제 API 테스트: 실패 - ${error}`);
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1단계 개발 환경 설정 테스트</CardTitle>
          <CardDescription>
            shadcn/ui 설치, 환경 변수 설정, API 함수들이 올바르게 작동하는지 확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? '테스트 실행 중...' : '테스트 다시 실행'}
          </Button>
          
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">테스트 결과:</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {testResults.join('\n')}
                </pre>
              </div>
            </div>
          )}
          
          <Alert>
            <AlertDescription>
              <strong>참고:</strong> 실제 API 테스트를 위해서는 .env.local 파일에 유효한 OpenWeatherMap API 키를 설정해야 합니다.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
