const cache_name = 'p-bud_cache_v0.0.1';
const file_to_cache = [
    './service_worker.js', '/pwa/manifest.json', '/pict/logo_blue_txt.png', '/bootstrap-5.3.3-dist/css/bootstrap.min.css',
    '/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js', '/pict/logo_blue_notxt.png', './index.html', './index.css', './index.js'
];

self.addEventListener('install', pEvent => {
    console.log("서비스 워커 설치");
    pEvent.waitUntil(
        caches.open(cache_name)
        .then(cache => {
            console.log("파일 저장");
            return cache.addAll(file_to_cache);
        })
    );
});

self.addEventListener('activate', pEvent => {
    console.log("시작");
    return self.clients.claim();
});

self.addEventListener('fetch', pEvent => {
    console.log('fetch event');
    pEvent.respondWith(
        // caches.match(pEvent.request)
        // .then(res => {
        //     if(!res) {
        //         console.log("네트워크 데이터", pEvent.request);
        //         return fetch(pEvent.request);
        //     }
        //     console.log("캐시 데이터", pEvent.request);
        //     return res;
        // }).catch(err => console.log(err))
        (async () => {
            const r = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            if (r) {
                return r;
            }
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;
        })(),
    );
});