export { default as Router } from './Router';
export { RouteHandler } from './Router';
export { default as CustomCacheKey } from './CustomCacheKey';
export { default as ResponseWriter } from './ResponseWriter';
/**
 * We've deprecated this to simplify the API. The examples in the docs now use `new CustomCacheKey()` instead.
 * @private
 * @deprecated Use `new CustomCacheKey()` instead.
 */
export { default as createCustomCacheKey } from './createCustomCacheKey';
