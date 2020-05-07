/**
 * Options for the `install` function.
 */
export interface InstallOptions {
    /**
     * Any link whose href matches one of these patterns will have its
     * href prefetched when the link becomes visible
     */
    prefetchPatterns?: RegExp[];
    /**
     * URLs to prefetch immediately
     */
    prefetchURLs?: string[];
    /**
     * The URL path on which the service worker is served.
     */
    serviceWorkerPath?: string;
}
/**
 * Installs the service worker, prefetches any URLs specified in `prefetchURLs` and watches
 * all links whose `href` attribute matches one of the specified `prefetchPatterns`.  When
 * a matching link is visible in the viewport, the destination URL will be prefetched and
 * added to the cache.
 * @param options
 */
export default function install(options?: InstallOptions): void;
