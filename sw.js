self.addEventListener('install', function (event) {
    console.log("service worker is installing", event);
    event.waitUntil(
        caches.open('staticchatapp').then(function (cache) {
            console.log("service worker precaching app shell");
            cache.addAll([
                '/',
                '/public/js/app.js',
                '/public/js/socket.io.js',
                '/public/css/style.css',
                '/public/manifest.json',
                'https://js.pusher.com/4.1/pusher.min.js',
                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/iconfont/material-icons.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',
                '/views/index.ejs'
            ])
        })
    )
});


self.addEventListener('activate', function (event) {
    console.log("service worker is activating", event);
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    //event.respondWith(fetch(event.request));
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open('dynamic')
                                .then(function (cache) {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        });
                }
            })
    );
});