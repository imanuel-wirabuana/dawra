/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    const { isServer } = options;
    
    // Configure Module Federation for micro frontend architecture
    // This is only applied on the client side for now
    if (!isServer) {
      try {
        const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

        config.plugins.push(
          new ModuleFederationPlugin({
            name: 'dawra_host',
            filename: 'static/chunks/remoteEntry.js',

            // This app exposes modules that can be consumed by other hosts
            exposes: {
              './shared-hooks': './lib/federation/shared-hooks.ts',
              './shared-types': './lib/federation/shared-types.ts',
              './shared-utils': './lib/federation/shared-utils.ts',
              './modules/chats': './lib/federation/modules/chats.ts',
              './modules/photos': './lib/federation/modules/photos.ts',
              './modules/bucket-lists': './lib/federation/modules/bucket-lists.ts',
              './modules/itineraries': './lib/federation/modules/itineraries.ts',
            },

            // Remote modules - ready for future multi-deployment scenarios
            // For now, this is empty since we're using single deployment
            remotes: {},

            // Shared dependencies across all modules
            shared: {
              react: { singleton: true, requiredVersion: false, strictVersion: false, eager: true },
              'react-dom': { singleton: true, requiredVersion: false, strictVersion: false, eager: true },
              '@tanstack/react-query': { singleton: true, requiredVersion: false, strictVersion: false },
              zustand: { singleton: true, requiredVersion: false, strictVersion: false },
              firebase: { singleton: true, requiredVersion: false, strictVersion: false },
              'next-themes': { singleton: true, requiredVersion: false, strictVersion: false },
              'class-variance-authority': { singleton: true, requiredVersion: false, strictVersion: false },
              clsx: { singleton: true, requiredVersion: false, strictVersion: false },
            },
          })
        );
      } catch (error) {
        console.warn('Module Federation configuration error:', error);
      }
    }

    return config;
  },
};

// Allow webpack config alongside Turbopack
nextConfig.turbopack = {};

export default nextConfig;
