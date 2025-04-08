export function loadOptionalModule<T = any>(moduleName: string, fallback?: T): T | undefined {
    try {
      const mod = require(moduleName);
      return mod?.default || mod;
    } catch (err) {
      if (__DEV__) {
        console.warn(`[OptionalModule] "${moduleName}" is not installed.`);
      }
      return fallback;
    }
  }
  