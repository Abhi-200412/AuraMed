/* Injected by MSW */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

self.addEventListener('fetch', async (event) => {
  const { request } = event
  const requestClone = request.clone()
  
  try {
    const response = await fetch(requestClone)
    return response
  } catch (error) {
    console.log('[MSW] Fetch failed, returning mock response')
    return new Response('Mock response', { status: 200 })
  }
})
