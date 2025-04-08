const CACHE_NAME = 'insurance-analysis-v3.0.2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ios-touch-fixes.js',
  './manifest.json',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-167.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-512.png',
  './icons/maskable-icon.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js'
];

// 安裝事件 - 預先快取資源
self.addEventListener('install', event => {
  console.log('Service Worker 安裝中');
  // 跳過等待，直接激活
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('快取資源中');
      return cache.addAll(ASSETS);
    })
  );
});

// 激活事件 - 清理舊快取
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('刪除舊快取:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('現在使用的快取:', CACHE_NAME);
      // 立即控制所有頁面
      return self.clients.claim();
    })
  );
});

// 攔截請求並提供快取響應
self.addEventListener('fetch', event => {
  // 處理相對路徑
  const url = new URL(event.request.url);
  const isPwaAsset = ASSETS.includes(url.pathname) || 
                     ASSETS.includes(`.${url.pathname}`) ||
                     ASSETS.includes(url.pathname.replace(/^\//, './'));
  
  // 跳過一些請求類型
  if (!isPwaAsset && 
      !url.pathname.includes('/icons/') && 
      !url.pathname.includes('/screenshots/') &&
      !event.request.url.includes('cdn.jsdelivr.net') && 
      !event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 如果找到快取的響應，返回快取
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 否則發起網絡請求
      return fetch(event.request).then(response => {
        // 檢查響應是否有效
        if (!response || response.status !== 200) {
          return response;
        }
        
        // 快取響應副本
        let responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    }).catch(() => {
      // 如果網絡請求失敗，嘗試返回offline頁面
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
