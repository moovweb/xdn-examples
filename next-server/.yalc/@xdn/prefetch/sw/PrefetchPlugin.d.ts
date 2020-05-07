import { WorkboxPlugin, RequestWillFetchCallbackParam, CacheKeyWillBeUsedCallbackParam, CacheWillUpdateCallbackParamParam } from 'workbox-core/types';
export declare class Stats {
    hits: number;
    misses: number;
}
export default class PrefetchPlugin implements WorkboxPlugin {
    stats: Stats;
    /**
     * Called when an object is read from or written to the cache.  Here we
     * compute cache stats and ensure that ?__prefetch__ is removed from the cache key so
     * that future requests for prefetched resources will match.
     */
    cacheKeyWillBeUsed({ request, mode }: CacheKeyWillBeUsedCallbackParam): Promise<Request>;
    /**
     * Called when the service worker fetches a response from the network. Here we
     * remove ?__prefetch__=1 and add the x-xdn-prefetch header.
     */
    requestWillFetch({ request }: RequestWillFetchCallbackParam): Promise<Request>;
    /**
     * Called when a response is about to be written to the cache.
     */
    cacheWillUpdate({ response }: CacheWillUpdateCallbackParamParam): Promise<Response | null>;
    /**
     * If the __prefetch__ query param is present, clones the request, removing the __prefetch__ query param if present and adding
     * an x-xdn-prefetch request header. We do this so that:
     * 1.) The resulting cached response will match future requests
     * 2.) The XDN can choose not to respond to prefetch events if the result is not in the cache.
     *
     * If the __prefetch__ query param is not present, the original request is returned.
     *
     * @param srcRequest The request to clone
     * @returns A clone of the srcRequest
     */
    convertPrefetchQueryParamToHeader(srcRequest: Request, url: URL): Request;
}
