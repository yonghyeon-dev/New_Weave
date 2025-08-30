// WEAVE Service Worker - Offline Support & Performance Optimization
const CACHE_NAME = 'weave-v1.0.0';
const RUNTIME_CACHE = 'weave-runtime';
const OFFLINE_URL = '/offline.html';

// 캐시할 정적 자원들
const STATIC_CACHE_URLS = [
  '/',
  '/home',
  '/offline.html',
  '/logo.png',
  '/manifest.json',
  // CSS와 JS는 Next.js가 자동으로 처리
];

// 캐시 전략 설정
const CACHE_STRATEGIES = {
  // 네트워크 우선, 실패시 캐시
  networkFirst: [
    '/api/',
    '/dashboard',
    '/projects',
    '/clients',
    '/invoices'
  ],
  // 캐시 우선, 백그라운드 업데이트
  staleWhileRevalidate: [
    '/static/',
    '/_next/static/',
    '/images/',
    '/icons/'
  ],
  // 캐시만 사용
  cacheOnly: [
    '/offline.html'
  ],
  // 네트워크만 사용
  networkOnly: [
    '/auth/',
    '/api/auth/',
    '/api/supabase/'
  ]
};

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch 이벤트
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 같은 도메인의 요청만 처리
  if (url.origin !== location.origin) {
    return;
  }

  // 캐시 전략 선택
  const strategy = getStrategy(url.pathname);
  
  switch (strategy) {
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    case 'cacheOnly':
      event.respondWith(cacheOnly(request));
      break;
    case 'networkOnly':
      event.respondWith(networkOnly(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

// 캐시 전략 결정
function getStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.includes(pattern))) {
      return strategy;
    }
  }
  return 'networkFirst';
}

// Network First 전략
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // HTML 요청인 경우 오프라인 페이지 반환
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Stale While Revalidate 전략
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Cache Only 전략
async function cacheOnly(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error('No cached response found');
}

// Network Only 전략
async function networkOnly(request) {
  return fetch(request);
}

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event');
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// 푸시 알림
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Weave 알림', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// 오프라인 데이터 동기화
async function syncData() {
  try {
    // IndexedDB에서 대기중인 데이터 가져오기
    const pendingData = await getPendingData();
    
    if (pendingData && pendingData.length > 0) {
      // 서버로 데이터 전송
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingData)
      });
      
      if (response.ok) {
        // 성공하면 로컬 데이터 삭제
        await clearPendingData();
        console.log('[SW] Data synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Helper functions for IndexedDB (simplified)
async function getPendingData() {
  // IndexedDB에서 데이터 가져오기 로직
  return [];
}

async function clearPendingData() {
  // IndexedDB 데이터 삭제 로직
}