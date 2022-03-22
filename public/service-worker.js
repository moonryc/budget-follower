const APP_PREFIX = 'BudgetFollower-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/indexdb.js'
];

self.addEventListener('install', function (e) {
    //tells the browser to wait until the work is complete
    e.waitUntil(
        //finds the specific cache by name, then adds every file in the FILES_TO_CACHE array to the cache
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then((keyList) => {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            //Add the current cache to the keeplist
            cacheKeeplist.push(CACHE_NAME);

            //If the remove all a values from cache that are not in the cache keep list
            return Promise.all(
                keyList.map((key, i) => {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                // if cache is available, respond with cache
                console.log('responding with cache : ' + e.request.url);
                return request;
            } else {
                // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url);
                return fetch(e.request);
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    );
});
