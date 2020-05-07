/// <reference types="cheerio" />
import { WorkboxPlugin, FetchDidSucceedCallbackParam } from 'workbox-core/types';
export interface DeepFetchCallbackParam {
    /**
     * The matching element, wrapped in a cheerio instance
     */
    $el: Cheerio;
    /**
     * The matching element
     */
    el: CheerioElement;
    /**
     * The cheerio static instance
     */
    $: CheerioStatic;
    /**
     * The URL of the page that was prefetched
     */
    srcURL: string;
}
interface DeepFetchConfig {
    /**
     * The CSS selector to use when finding elements whose src or href should be deep fetched
     */
    selector: string;
    /**
     * The max number of matching elements to prefetch per page
     */
    maxMatches?: number;
    /**
     * The attribute whose value should be prefetched. Defaults to `src`.
     */
    attribute: string;
    /**
     * The value for the link rel="prefetch|preload" element's `as` attrbute.
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link.  Use "fetch" for html pages as Safari doesn't support "document".
     */
    as: 'image' | 'script' | 'style' | 'font';
    /**
     * A callback to override the default prefetching logic. Will be called for each matching element,
     * or if maxMatches is provided, the first n elements.
     */
    callback?: (param: DeepFetchCallbackParam) => void;
}
/**
 * This plugin deep fetches resources during prefetching based on CSS selectors.
 *
 * ** Example **
 *
 * ```js
 *  import DeepFetchPlugin from '@xdn/prefetch/sw/DeepFetchPlugin'
 *  import { Prefetcher } from '@xdn/prefetch/sw'
 *
 *  new Prefetcher({
 *    plugins: [
 *      new DeepFetchPlugin([
 *        {
 *          selector: 'img.product-main-image,
 *          maxMatches: 1,
 *          as: 'image',
 *          attribute: 'src'
 *        }
 *      ])
 *    ]
 *  })
 * ```
 */
export default class DeepFetchPlugin implements WorkboxPlugin {
    config: DeepFetchConfig[];
    constructor(config: DeepFetchConfig[]);
    /**
     * WorkboxPlugin method called every time a fetch succeeds.
     */
    fetchDidSucceed({ request, response }: FetchDidSucceedCallbackParam): Promise<Response>;
    /**
     * Deep fetches elements that match the selectors provided by the user.
     * @param html The document to search
     */
    private deepFetch;
}
export {};
