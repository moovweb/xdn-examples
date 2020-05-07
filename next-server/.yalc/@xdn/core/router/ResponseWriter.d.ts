import Route from './Route';
import Request from './Request';
import Response from './Response';
import CustomCacheKey from './CustomCacheKey';
import BackendOptions from './BackendOptions';
/**
 * @private
 * Having a no-op BaseResponseWriter makes it easy for us to stub out the writer
 * when introspecing the router.  This is needed to implement Router.getPrefetchableRoutes
 */
export declare class BaseResponseWriter {
    constructor(req?: Request, res?: Response, route?: Route);
    cache(options: CacheOptions): void;
    redirect(to: string, statusCode: number): void;
    proxy(backend: string, options?: ProxyOptions): Promise<void>;
    render(cb: (request: Request, proxy: (backend: string, options: ProxyOptions) => Promise<void>, params: any) => void): Promise<void>;
    stream(backend: string): void;
    serveStatic(path: string): Promise<void>;
    setResponseHeader(name: string, value: string): void;
    updateResponseHeader(name: string, match: RegExp, replace: string): void;
    removeResponseHeader(name: string): void;
    setRequestHeader(name: string, value: string): void;
    updateRequestHeader(name: string, match: RegExp, replace: string): void;
    removeRequestHeader(name: string): void;
    send(content: string | (() => string), statusCode: number, statusMessage?: string): void;
}
/**
 * The API that is provided to route callbacks.
 */
export default class ResponseWriter extends BaseResponseWriter {
    private readonly params;
    private request;
    private response;
    private route;
    private routeParams;
    private queryParams;
    private _sendResponse?;
    /**
     * @param req The request
     * @param res The response
     * @param route The route
     * @param defaultBackend The default backend for proxy when none is provided
     */
    constructor(req: Request, res: Response, route: Route);
    /**
     * Called at the end of the request to send the response back to the browser. Methods like proxy,
     * serveStatic, and render will replace this method with one that actually sends a response.
     * @private
     * @returns True if there send response was defined and invoked, otherwise false.
     */
    sendResponse(): boolean;
    /**
     * Redirects the browser to a new location.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/p/:productId', ({ redirect }) => {
     *      return redirect('/products/{productId}', 301)
     *    })
     * ```
     *
     * @param to The URL to which the browser will be redirected.
     * @param statusCode The HTTP status to return.  Defaults to 301
     */
    redirect: (to: string, statusCode?: number) => void;
    /**
     * Relays the request to the specified backend.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path/with/:variable', ({ proxy }) => {
     *      return proxy('legacy', { path: '/some/other/path/with/{variable}' })
     *    })
     * ```
     *
     * In this example, we relay the request to the "legacy" backend. In this case, `xdn.config.js` must
     * contain a definition for the `legacy` backend.  For example:
     *
     * ```
     *  // xdn.config.js
     *
     *  module.exports = {
     *    backends: {
     *      legacy: {
     *        domainOrIp: 'legacy.domain.com',
     *        hostHeader: 'domain.com'
     *      }
     *    }
     *  }
     * ```
     *
     * @param backend The name of one of the backends in your `xdn.config.js` file.
     * @param options
     * @returns A promise the resolves once the response has been fetched from the upstream site.
     */
    proxy: (backend: string, options?: ProxyOptions | undefined) => Promise<void>;
    /**
     * Call render callback
     * @param cb Render callback function
     */
    render: (cb: (request: Request, proxy: (backend: string, options: ProxyOptions) => Promise<void>, params: any) => void) => Promise<void>;
    /**
     * Streams the result from a backend.  Can only be used in development for things
     * like hot-module reloading.
     * @param backend The name of the backend to connect to
     * @private
     */
    stream: (backend: string) => void;
    /**
     * Proxies the response from a given host
     * @private
     * @param backendConfig The backend config
     * @param options
     */
    proxyHost: (backendConfig: BackendOptions, { path, transformResponse }?: ProxyOptions) => Promise<void>;
    /**
     * Responds with a static asset from the specified path.
     *
     * **Example**
     *
     * ```js
     * serveStatic('path/to/asset/from/app/root')
     * ```
     *
     * You can also use variables in the asset path.  For example, to return files under the `assets` directory
     * when the url starts with `/static`:
     *
     * ```
     *  new Router()
     *    .match('/static/*path', ({ serveStatic }) => {
     *      return serveStatic('assets/{path}')
     *    })
     * ```
     *
     * @param path The relative path to the asset from the app's root directory. You can reference path variables using `{variable}`.
     * @returns A promise the resolves once the asset has been fetched from storage.
     */
    serveStatic: (path: string) => Promise<void>;
    /**
     * Sets the caching behavior for both browser and edge.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/p/:productId', ({ cache, proxy }) => {
     *      cache({
     *        browser: {
     *          maxAgeSeconds: 0,
     *          serviceWorkerSeconds: 60 * 60, // 1 hour
     *        },
     *        edge: {
     *          maxAgeSeconds: 60 * 60 * 24 // 24 hours
     *          staleWhileRevalidateSeconds: 60 * 60 // 1 hour
     *        }
     *      })
     *      return proxy('origin')
     *    })
     * ```
     *
     * The `cache()` method can be called in the same route where the response is sent, or any prior route.  For example,
     * with Next.js, it is common to use the next plugin to automatically inherit page routes based on Next.js conventions,
     * and use the XDN router simply to add caching:
     *
     * ```
     *  import { Router } = from '@xdn/core/router'
     *  import { createNextPlugin } from '@xdn/next'
     *
     *  const { nextMiddleware, renderNext } = createNextPlugin()
     *
     *  new Router()
     *    .match('/p/:productId', ({ cache, proxy }) => {
     *      cache({
     *        browser: {
     *          maxAgeSeconds: 0,
     *          serviceWorkerSeconds: 60 * 60, // 1 hour
     *        },
     *        edge: {
     *          maxAgeSeconds: 60 * 60 * 24 // 24 hours
     *          staleWhileRevalidateSeconds: 60 * 60 // 1 hour
     *        }
     *      })
     *      return proxy('origin')
     *    })
     *    .use(nextMiddleware)
     * ```
     */
    cache: (options: CacheOptions) => void;
    /**
     * Adds or replaces a response header.
     * This method should be called after `proxy`.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path', async ({ setResponseHeader, proxy }) => {
     *      await proxy('origin')
     *      setResponseHeader('some-header', 'some-value')
     *    })
     * ```
     *
     * @param name The case-insensitive name of the response header
     * @param value The value to set
     */
    setResponseHeader: (name: string, value: string) => void;
    /**
     * @private
     */
    private unsafeSetResponseHeader;
    /**
     * Alters a response header. Use this method to derive the new header value from the existing one.
     * This method should be called after `proxy`.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path', async ({ updateResponseHeader, proxy }) => {
     *      await proxy('origin')
     *      updateResponseHeader('some-header', /some-.*-part/gi, 'some-replacement')
     *    })
     * ```
     *
     * @param name The case-insensitive name of the response header
     * @param match Regex to find the part that should be replaced.
     * @param replace Value that will replace the matched part.
     */
    updateResponseHeader: (name: string, match: RegExp, replace: string) => void;
    /**
     * Removes a response header. This method should be called after `proxy`.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path', async ({ removeResponseHeader, proxy }) => {
     *      await proxy('origin')
     *      removeResponseHeader('some-header')
     *    })
     * ```
     * @param name The case-insensitive name of the response header
     */
    removeResponseHeader: (name: string) => void;
    /**
     * Adds or replaces a request header.
     * This method should be called before `proxy`.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path', async ({ setRequestHeader, proxy }) => {
     *      setRequestHeader('some-header', 'some-value')
     *      await proxy('origin')
     *    })
     * ```
     *
     * @param name The case-insensitive name of the request header
     * @param value The value to set
     */
    setRequestHeader: (name: string, value: string) => void;
    /**
     * Alters a request header. Use this method to derive the new header value from the existing one.
     * This method should be called before `proxy`.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path', async ({ updateRequestHeader, proxy }) => {
     *      updateRequestHeader('some-header', /some-.*-part/gi, 'some-replacement')
     *      await proxy('origin')
     *    })
     * ```
     *
     * @param name The case-insensitive name of the request header
     * @param match Regex to find the part that should be replaced.
     * @param replace Value that will replace the matched part.
     */
    updateRequestHeader: (name: string, match: RegExp, replace: string) => void;
    /**
     * Removes a request header.
     * This method should be called before `proxy`.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path', async ({ removeRequestHeader, proxy }) => {
     *      removeRequestHeader('some-header')
     *      await proxy('origin')
     *    })
     * ```
     * @param name The case-insensitive name of the request header
     */
    removeRequestHeader: (name: string) => void;
    /**
     * Sends content back to client. If content is a string, the respons will be sent
     * directly from the edge. If it is a function, the request will be computed by a JavaScript worker.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path', ({ send }) => {
     *      return send('<html><body>Hello World!</body></html>', 200, 'OK')
     *    })
     * ```
     * @param content The response body as a string
     * @param statusCode The status to send
     * @param statusMessage The status message to send
     */
    send: (content: string | (() => string), statusCode?: number, statusMessage?: string | undefined) => void;
    /**
     * Send json error response to client
     * @private
     * @param err
     */
    onRouteError: (err: Error) => void;
}
/**
 * Options for the `proxy` method
 */
export interface ProxyOptions {
    /**
     * The path for the URL to request from the upstream site. You can reference variables
     * captured by the route pattern using `{variable}`.
     *
     * **Example**
     *
     * ```
     *  new Router()
     *    .match('/some/path/with/:variable', ({ proxy }) => {
     *      return proxy('legacy', { path: '/some/other/path/with/{variable}' })
     *    })
     * ```
     */
    path?: string;
    /**
     * A function that transforms the response before it is returned to the browser. This function
     * typically alters `response.body` to change the content sent to the browser. It can also add, remove,
     * and alter response headers.
     */
    transformResponse?: (response: Response) => void;
}
/**
 * Options for controlling caching behavior in the browser and at the network edge.
 */
export interface CacheOptions {
    /**
     * Sets the caching behavior at edge.
     */
    edge?: EdgeCacheOptions;
    /**
     * Sets the caching behavior in the browser
     */
    browser?: BrowserCacheOptions;
}
/**
 * Options for controlling caching behavior at edge
 */
export interface EdgeCacheOptions {
    /**
     * The maximum number of seconds that a response is served from the cache until it is
     * considered stale. Unless `staleWhileRevalidate` is specified, stale responses will
     * not be returned to the browser.
     */
    maxAgeSeconds?: number;
    /**
     * Extends the duration that a response will be served from the cache after it has become stale.
     * When using staleWhileRevalidate, if the XDN receives a request for a stale asset, the cached
     * response will be served and a fresh response will be concurrently fetch so that it can be served
     * for future requests. The stale response will continue to be served until the fresh fetched.
     */
    staleWhileRevalidateSeconds?: number;
    /**
     * Allows you to split or normalize the cache space for a given route. Common use cases include:
     *
     * - serving multiple variants of the same URL based on a currency and/or language cookie.
     * - caching different responses based on device type
     * - ignoring all but a specific set of query parameters when looking up a response from the cache.
     *
     * **Example**
     *
     * ```js
     *  import { Router, CustomCacheKey } from '@xdn/core/router'
     *
     *  new Router()
     *    .match('/some-path', ({ cache }) => {
     *      cache({
     *        edge: {
     *          maxAgeSeconds: 60 * 60,
     *          key: new CustomCacheKey()
     *            .excludeAllQueryParametersExcept('color', 'size')
     *            .addCookie('currency')
     *            .addCookie('location', cookie => {
     *              cookie.group('na').byPattern('us|ca')
     *              cookie.group('eur').byPattern('de|fr|ee')
     *            })
     *        }
     *      })
     *    })
     * ```
     */
    key?: CustomCacheKey;
}
/**
 * Options for controlling caching behavior in the browser
 */
export interface BrowserCacheOptions {
    /**
     * Sets the `max-age` value of the `cache-control` header sent to the browser.  This controls the duration
     * that the response is held in the browser's http cache.
     */
    maxAgeSeconds?: number;
    /**
     * Sends an `x-sw-cache-control` header with a value of `max-age={serviceWorkerSeconds}`.  This is not a standard
     * header that service workers understand by default.  You'll need to implement logic to handle this in your service worker.
     */
    serviceWorkerSeconds?: number;
}
