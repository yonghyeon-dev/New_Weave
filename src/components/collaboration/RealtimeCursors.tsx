'use client';

import { useEffect, useState } from 'react';
import { useRealtimeCursor } from '@/hooks/useRealtimeCursor';

interface RealtimeCursorsProps {
  roomId: string;
  userId: string;
  userName: string;
  userColor?: string;
  showLabels?: boolean;
  smoothing?: boolean;
}

export function RealtimeCursors({
  roomId,
  userId,
  userName,
  userColor,
  showLabels = true,
  smoothing = true
}: RealtimeCursorsProps) {
  const { cursors, isConnected } = useRealtimeCursor({
    roomId,
    userId,
    userName,
    userColor,
    enableSmoothing: smoothing
  });

  if (!isConnected) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {cursors.map(cursor => (
        <div
          key={cursor.userId}
          className="absolute transition-all"
          style={{
            transform: `translate(${cursor.position.x}px, ${cursor.position.y}px)`,
            opacity: cursor.isActive ? 1 : 0.5,
            transition: smoothing ? 'transform 100ms ease-out' : 'none'
          }}
        >
          {/* 커서 아이콘 */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`,
              transform: 'rotate(-45deg)'
            }}
          >
            <path
              d="M3 3L21 11.5L12.5 12.5L11.5 21L3 3Z"
              fill={cursor.userColor || '#3B82F6'}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          
          {/* 사용자 라벨 */}
          {showLabels && (
            <div
              className="absolute left-6 top-0 px-2 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap"
              style={{
                backgroundColor: cursor.userColor || '#3B82F6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {cursor.userName}
            </div>
          )}
          
        </div>
      ))}
    </div>
  );
}