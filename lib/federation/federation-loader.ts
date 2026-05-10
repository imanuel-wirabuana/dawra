// Federation Module Loader
// Utilities for dynamically loading micro frontend modules

import { moduleRegistry, type ModuleMetadata } from './module-registry';

export interface LoadModuleOptions {
  scope?: string;
  module?: string;
  shareScope?: string;
}

/**
 * Load a micro frontend module dynamically
 * @param moduleName - The name of the module to load (e.g., 'chats_module')
 * @param modulePath - The path of the module (e.g., './modules/chats')
 * @param options - Additional loading options
 */
export async function loadModule<T = any>(
  moduleName: string,
  modulePath: string,
  options: LoadModuleOptions = {}
): Promise<T> {
  const { scope = moduleName, module = modulePath, shareScope = 'default' } = options;

  return new Promise((resolve, reject) => {
    try {
      const container = (window as any)[scope];

      if (!container) {
        reject(new Error(`Module container '${scope}' not found`));
        return;
      }

      if (!container.__initialized) {
        container.init({ [shareScope]: (window as any).__FEDERATION_SCOPE__ || {} });
        container.__initialized = true;
      }

      container.get(module).then((factory: () => T) => {
        const moduleInstance = factory();
        resolve(moduleInstance);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Register module metadata
 */
export function registerModule(metadata: ModuleMetadata): void {
  moduleRegistry.register(metadata);
}

/**
 * Get all registered modules
 */
export function getRegisteredModules() {
  return moduleRegistry.getAll();
}

/**
 * Check if a module is available
 */
export function isModuleAvailable(moduleName: string): boolean {
  return moduleRegistry.has(moduleName);
}

/**
 * Safe module loader with error handling
 */
export async function safeLoadModule<T = any>(
  moduleName: string,
  modulePath: string,
  options?: LoadModuleOptions
): Promise<T | null> {
  try {
    return await loadModule<T>(moduleName, modulePath, options);
  } catch (error) {
    console.error(`Failed to load module '${moduleName}':`, error);
    return null;
  }
}
