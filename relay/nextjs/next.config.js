const withOffline = require('next-offline');

const nextConfig = {
  target: 'serverless',
  transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
  // Whether to enable the SW in development. Note this may not work
  // if we don't have a custom _error.js file:
  // https://github.com/hanford/next-offline/issues/190#issuecomment-535278921
  generateInDevMode: false,
  workboxOpts: {
    swDest: 'public/service-worker.js',
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    // TODO:
    // Configure different strategies:
    // https://github.com/hanford/next-offline#cache-strategies
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'https-calls',
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
            // Automatically cleanup if quota is exceeded.
            purgeOnQuotaError: true,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
};

module.exports = withOffline(nextConfig);
