var CACHE_NAME = 'exam-plan-cache-v1';
var FILES_TO_CACHE = [
  'index.html',
  'study-plan-manifest.json',
  'study-icon-192.png',
  'study-icon-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(cached){
      if(cached) return cached;
      return fetch(event.request).then(function(response){
        return caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function(){
        return cached;
      });
    })
  );
});
