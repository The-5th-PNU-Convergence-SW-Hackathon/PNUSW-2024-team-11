const cache_name = 'p-bud_cache_v0.0.1';
const file_to_cache = [
    '/pwa/service_worker.js', '/pwa/manifest.json', '/pict/logo_blue_txt.png', '/bootstrap-5.3.3-dist/css/bootstrap.min.css',
    '/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js', '/pict/logo_blue_notxt.png', '/home.html', '/index.css', '/index.js'
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
    pEvent.respondWith(
        caches.match(pEvent.request)
        .then(res => {
            if(!res) {
                console.log("네트워크 데이터", pEvent.request);
                return fetch(pEvent.request);
            }
            console.log("캐시 데이터", pEvent.request);
            return res;
        }).catch(err => console.log(err))
    );
});