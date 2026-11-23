// Offline support: pages are fetched fresh when online and served from cache when offline.
// The 3D library and fonts rarely change, so they come from cache first.
const CACHE='game-v1';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  const staticLib=url.hostname==='cdnjs.cloudflare.com'||url.hostname.endsWith('gstatic.com')||url.hostname==='fonts.googleapis.com';
  if(staticLib){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req).then(hit=>hit||fetch(req).then(res=>{c.put(req,res.clone());return res}))));
  }else if(url.origin===location.origin){
    e.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res}).catch(()=>caches.match(req)));
  }
});
