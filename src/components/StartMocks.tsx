"use client";

import { useEffect } from 'react';

export default function StartMocks() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Only attempt to start MSW in the browser (dev mode). If worker isn't present, ignore.
    async function start() {
      try {
        // dynamic import so this doesn't run on server
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = await import('../mocks/browser');
        if (mod?.worker && typeof mod.worker.start === 'function') {
          // start the service worker (no await needed)
          void mod.worker.start();
          // console.log('MSW worker started')
        }
      } catch (err) {
        // ignore errors (msw not installed in prod etc.)
        // console.debug('MSW not started', err)
      }
    }

    start();
  }, []);

  return null;
}
