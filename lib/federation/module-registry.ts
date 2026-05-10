// Module Federation Registry
// Manages the loading and registration of micro frontend modules

export interface ModuleMetadata {
  name: string;
  displayName: string;
  route: string;
  description: string;
  version: string;
}

export interface RegisteredModule {
  metadata: ModuleMetadata;
  loadedAt: Date;
}

class ModuleRegistry {
  private modules: Map<string, RegisteredModule> = new Map();

  register(metadata: ModuleMetadata): void {
    this.modules.set(metadata.name, {
      metadata,
      loadedAt: new Date(),
    });
  }

  get(name: string): RegisteredModule | undefined {
    return this.modules.get(name);
  }

  getAll(): RegisteredModule[] {
    return Array.from(this.modules.values());
  }

  has(name: string): boolean {
    return this.modules.has(name);
  }

  unregister(name: string): boolean {
    return this.modules.delete(name);
  }

  clear(): void {
    this.modules.clear();
  }
}

export const moduleRegistry = new ModuleRegistry();
