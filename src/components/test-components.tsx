'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export function TestComponents() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">1단계 테스트 - shadcn/ui 컴포넌트</h1>
      
      {/* Button 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>Button 컴포넌트 테스트</CardTitle>
          <CardDescription>shadcn/ui Button 컴포넌트가 정상적으로 렌더링되는지 확인</CardDescription>
        </CardHeader>
        <CardContent className="space-x-2">
          <Button>기본 버튼</Button>
          <Button variant="secondary">Secondary 버튼</Button>
          <Button variant="destructive">Destructive 버튼</Button>
          <Button variant="outline">Outline 버튼</Button>
        </CardContent>
      </Card>

      {/* Input 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>Input 컴포넌트 테스트</CardTitle>
          <CardDescription>shadcn/ui Input 컴포넌트가 정상적으로 렌더링되는지 확인</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="도시명을 입력하세요..." />
          <Input type="email" placeholder="이메일을 입력하세요..." />
        </CardContent>
      </Card>

      {/* Switch 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>Switch 컴포넌트 테스트</CardTitle>
          <CardDescription>shadcn/ui Switch 컴포넌트가 정상적으로 작동하는지 확인</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
          />
          <span>Switch 상태: {isEnabled ? '활성화' : '비활성화'}</span>
        </CardContent>
      </Card>

      {/* Alert 테스트 */}
      <Alert>
        <AlertDescription>
          shadcn/ui Alert 컴포넌트가 정상적으로 렌더링됩니다. 
          모든 컴포넌트가 올바르게 설치되었습니다!
        </AlertDescription>
      </Alert>
    </div>
  );
}

