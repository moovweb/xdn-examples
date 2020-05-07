/**
 * Prefetches and caches the specified URL.
 *
 * **Example**
 *
 * ```js
 * import { prefetch } from '@xdn/prefetch/window
 *
 * prefetch('/some/url')
 * ```
 * @param url The URL to prefetch
 */
export declare function prefetch(url: string, as?: string): Promise<void>;
