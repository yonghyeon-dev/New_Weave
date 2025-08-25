import { Suspense } from 'react';
import WeaveAssistant from '@/components/ai-assistant/WeaveAssistant';

function AIAssistantContent() {
  return <WeaveAssistant />;
}

export default function AIAssistantPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩중...</div>}>
      <AIAssistantContent />
    </Suspense>
  );
}