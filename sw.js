const CACHE_NAME = 'csd-offline-v15.0.0';
const PRECACHE = [
  './',
  './index.html',
  './gmx-runtime.html',
  './reset.html',
  './diagnostics.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './EMULATORJS-LICENSE.txt',
  './THIRD-PARTY-NOTICE.txt',
  './data/emulator.css',
  './data/loader.js',
  './data/version.json',
  './data/localization/en-US.json',
  './data/localization/retroarch.json',
  './data/src/GameManager.js',
  './data/src/compression.js',
  './data/compression/README.md',
  './data/compression/extract7z.js',
  './data/compression/extractzip.js',
  './data/compression/libunrar.js',
  './data/compression/libunrar.wasm',
  './data/src/emulator.js',
  './data/src/gamepad.js',
  './data/src/nipplejs.js',
  './data/src/socket.io.min.js',
  './data/src/storage.js',
  './data/cores/reports/desmume2015.json',
  './data/cores/reports/fceumm.json',
  './data/cores/reports/gambatte.json',
  './data/cores/reports/genesis_plus_gx.json',
  './data/cores/reports/mgba.json',
  './data/cores/reports/parallel_n64.json',
  './data/cores/reports/snes9x.json',
  './data/cores/desmume2015-legacy-wasm.data',
  './data/cores/desmume2015-wasm.data',
  './data/cores/fceumm-legacy-wasm.data',
  './data/cores/fceumm-wasm.data',
  './data/cores/gambatte-legacy-wasm.data',
  './data/cores/gambatte-wasm.data',
  './data/cores/genesis_plus_gx-legacy-wasm.data',
  './data/cores/genesis_plus_gx-wasm.data',
  './data/cores/mgba-legacy-wasm.data',
  './data/cores/mgba-wasm.data',
  './data/cores/parallel_n64-legacy-wasm.data',
  './data/cores/parallel_n64-wasm.data',
  './data/cores/snes9x-legacy-wasm.data',
  './data/cores/snes9x-wasm.data'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const path of PRECACHE) {
      const request = new Request(path, { cache: 'reload' });
      const response = await fetch(request);
      if (!response.ok) throw new Error('Precache failed: ' + path + ' (' + response.status + ')');
      await cache.put(request, response);
    }
    // Do not force an update takeover while a game may be running.
    // A fresh install activates normally; updates activate on the next safe navigation.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    const canonical = new Request(url.pathname.endsWith('gmx-runtime.html') ? './gmx-runtime.html' :
      url.pathname.endsWith('reset.html') ? './reset.html' : './index.html');
    const cachePromise = caches.open(CACHE_NAME);
    const refreshPromise = cachePromise.then(cache =>
      fetch(event.request, { cache: 'no-store' }).then(async response => {
        if (response && response.ok) await cache.put(canonical, response.clone());
        return response;
      }).catch(() => null)
    );
    event.waitUntil(refreshPromise.then(() => undefined));
    event.respondWith(cachePromise.then(async cache => {
      const cached = await cache.match(canonical);
      // Return the installed shell immediately. A slow/offline navigation must never
      // leave iOS displaying a blank white page while it waits on the network.
      return cached || await refreshPromise || new Response('Offline shell unavailable', { status: 503 });
    }));
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, response.clone());
    }
    return response;
  })());
});
