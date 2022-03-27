// Ao instalar o ServiceWorker vamos fazer cache dos caminhos descritos
self.addEventListener("install", e => {
	e.waitUntil(
		caches.open("static").then(cache => {
			return cache.addAll(["/", "/src/master.css", "/images/logos/logo_x512.png"])
		})
	);
});

// Para cada request que o browser recebe o ServiceWorker faz cache da mesma
self.addEventListener("fetch", e => {
	e.respondWith(
		caches.match(e.request).then(response =>{
			return response || fetch(e.request);
		})
	);
});