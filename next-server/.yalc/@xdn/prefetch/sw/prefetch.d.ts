/**
 * Prefetches an asset.
 * @param url The asset URL
 * @param as The value for the link element's `as` attribute.
 *  See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link.
 *  Use "fetch" for html pages as Safari doesn't support "document".
 */
export declare function prefetch(url: string, as?: 'fetch' | 'image' | 'script' | 'style' | 'font'): any;
/**
 * Returns true if the request is a prefetch, otherwise false
 * @param request
 */
export declare function isPrefetch(request: Request): boolean;
