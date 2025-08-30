'use client';

import { usePresence, UserPresence } from '@/hooks/usePresence';
import Tooltip from '@/components/ui/Tooltip';

interface PresenceAvatarsProps {
  roomId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  maxAvatars?: number;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

export function PresenceAvatars({
  roomId,
  userId,
  userName,
  userEmail,
  maxAvatars = 5,
  size = 'md',
  showStatus = true,
  className = ''
}: PresenceAvatarsProps) {
  const { users, onlineCount, isConnected } = usePresence({
    roomId,
    userId,
    userName,
    userEmail
  });

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
  };

  const visibleUsers = users.slice(0, maxAvatars);
  const remainingCount = Math.max(0, users.length - maxAvatars);

  if (!isConnected) return null;

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visibleUsers.map((user, index) => (
        <div
          key={user.userId}
          className="relative transition-all duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Tooltip content={
            <div className="text-sm">
              <div className="font-medium">{user.userName}</div>
              {user.userEmail && (
                <div className="text-xs opacity-75">{user.userEmail}</div>
              )}
              <div className="text-xs capitalize mt-1">
                Status: {user.status}
              </div>
              {user.currentPage && (
                <div className="text-xs mt-1">
                  On: {user.currentPage}
                </div>
              )}
              {user.device && (
                <div className="text-xs mt-1">
                  Device: {user.device.type} - {user.device.browser}
                </div>
              )}
            </div>
          }>
            <div className="relative">
              {/* 아바타 */}
              <div className={`
                ${sizeClasses[size]}
                rounded-full
                bg-gradient-to-br
                from-blue-400
                to-purple-600
                flex
                items-center
                justify-center
                text-white
                font-medium
                ring-2
                ring-white
                shadow-lg
                cursor-pointer
                hover:scale-110
                transition-transform
              `}>
                {user.userAvatar ? (
                  <img
                    src={user.userAvatar}
                    alt={user.userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                )}
              </div>
              
              {/* 상태 표시자 */}
              {showStatus && (
                <div className={`
                  absolute
                  bottom-0
                  right-0
                  w-3
                  h-3
                  rounded-full
                  ${statusColors[user.status]}
                  ring-2
                  ring-white
                `} />
              )}
              
              {/* 타이핑 표시자 */}
              {user.isTyping && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </Tooltip>
        </div>
      ))}
      
      {/* 남은 사용자 수 표시 */}
      {remainingCount > 0 && (
        <div
          className={`
            ${sizeClasses[size]}
            rounded-full
            bg-gray-200
            dark:bg-gray-700
            flex
            items-center
            justify-center
            text-gray-600
            dark:text-gray-300
            font-medium
            ring-2
            ring-white
            shadow-lg
          `}
        >
          +{remainingCount}
        </div>
      )}
      
      {/* 온라인 카운트 */}
      <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
        {onlineCount} 명 온라인
      </div>
    </div>
  );
}