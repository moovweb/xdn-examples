import CustomCacheKey from './CustomCacheKey';
export default interface CacheOptions {
    edge?: EdgeCacheOptions;
    browser?: BrowserCacheOptions;
}
export interface EdgeCacheOptions {
    maxAgeSeconds?: number;
    staleWhileRevalidateSeconds?: number;
    key?: CustomCacheKey;
}
export interface BrowserCacheOptions {
    maxAgeSeconds?: number;
    serviceWorkerSeconds?: number;
}
