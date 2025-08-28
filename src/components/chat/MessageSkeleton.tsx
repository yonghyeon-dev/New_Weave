'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function MessageSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      {/* 아바타 스켈레톤 */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bg-tertiary" />
      
      {/* 메시지 버블 스켈레톤 */}
      <div className="flex-1 max-w-[70%]">
        <Card className="p-4 rounded-lg bg-white border-border-light">
          <div className="space-y-2">
            <div className="h-4 bg-bg-tertiary rounded w-3/4" />
            <div className="h-4 bg-bg-tertiary rounded w-full" />
            <div className="h-4 bg-bg-tertiary rounded w-2/3" />
          </div>
          
          <div className="mt-3 flex items-center gap-2">
            <div className="h-3 bg-bg-tertiary rounded w-16" />
            <div className="h-3 bg-bg-tertiary rounded w-12" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// 전체 대화 스켈레톤
export function ChatSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 사용자 메시지 스켈레톤 */}
      <div className="flex gap-3 flex-row-reverse animate-pulse">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-weave-primary/30" />
        <div className="flex-1 max-w-[70%]">
          <Card className="p-4 rounded-lg bg-weave-primary/10 border-weave-primary/30">
            <div className="h-4 bg-weave-primary/20 rounded w-full" />
          </Card>
        </div>
      </div>
      
      {/* AI 응답 스켈레톤 */}
      <MessageSkeleton />
      
      {/* 추가 메시지들 */}
      <div className="opacity-50">
        <MessageSkeleton />
      </div>
      
      <div className="opacity-30">
        <MessageSkeleton />
      </div>
    </div>
  );
}

// 사이드바 스켈레톤
export function SidebarSkeleton() {
  return (
    <div className="overflow-y-auto p-4 animate-pulse">
      <div className="mb-4">
        <div className="h-10 bg-bg-tertiary rounded-lg" />
      </div>
      
      <div className="h-4 bg-bg-tertiary rounded w-24 mb-3" />
      
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-3 rounded-lg border border-border-light bg-white">
            <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-2" />
            <div className="flex items-center justify-between">
              <div className="h-3 bg-bg-tertiary rounded w-20" />
              <div className="h-3 bg-bg-tertiary rounded w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}