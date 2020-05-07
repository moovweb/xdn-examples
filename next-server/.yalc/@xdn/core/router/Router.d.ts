import RouteGroup from './RouteGroup';
import RouteGroupList from './RouteGroupList';
import ResponseWriter from './ResponseWriter';
import PluginBase from '../plugins/PluginBase';
import BackendOptions from './BackendOptions';
import Request from './Request';
import Response from './Response';
import CacheOptions from './CacheOptions';
export interface RouterOptions {
    /**
     * If `true`, built in routes under /__xdn__/ will be not be added to the router.
     */
    excludeBuiltInRoutes: boolean;
}
/**
 * A router.
 */
export default class Router {
    private readonly routeGroups;
    private readonly plugins;
    private readonly destinations;
    private nextRouterIndex;
    /**
     * Index is used to determine the precedence of a router when routing rules
     * have not resolved to a specific destination. The router with the lowest
     * number wins.
     * @private
     *
     */
    private _index;
    constructor(options?: RouterOptions);
    /**
     * Allows the lambda handler to add the __js__ backend in the cloud
     * @private
     * @param {String} name
     * @param {BackendOptions} value
     */
    setBackend(name: string, value: BackendOptions): void;
    /**
     * Constructs plugin and pushes it to registered plugins
     * @param {Class} pluginInstance A plugin to use.
     * @returns {Router} A self-reference, suitable for chaining.
     */
    use(pluginInstance: PluginBase): this;
    /**
     * Adds a named destination to which you can map traffic using the traffic shaping settings in your environment
     * in the XDN developer console
     * @param {String} name The name of the destination
     * @param {Router} router A router to use when handling requests
     * @returns {Router} A self-reference, suitable for chaining.
     */
    destination(name: string, router: Router): this;
    /**
     * Returns all plugins, including those registered on destination routers.
     */
    getPlugins(): PluginBase[];
    /**
     * Sets the index at which the router has been added to its parent router
     * @private
     * @param {Number} index
     */
    setIndex(index: number): void;
    /**
     * Returns the index at which the router has been added to its parent router
     * @private
     * @returns router's index
     */
    get index(): number;
    /**
     * Adds a RouteGroup to router and calls route register function for group.
     * @private
     * @param {String} name Group name
     * @param {Function} registerRoutesFn Group route register function
     * @returns {Router} A self-reference, suitable for chaining.
     */
    group(name: string, registerRoutesFn: (group: RouteGroup) => void): this;
    /**
     * Adds a route.
     *
     * Example:
     *
     * ```js
     *  new Router().match('/p/:productId', async ({ cache, proxy }) => {
     *    cache({
     *      edge: {
     *        maxAgeSeconds: 60 * 60 * 24
     *      }
     *    })
     *
     *    await proxy('origin')
     *  })
     * ```
     *
     * @param {String|Object} criteria Either the path as a string or an object with `path`, `method`, and `headers`.
     * @param {Function} handler A function that accepts a `WrappedResponse`, `Request`, and `params` object.
     * @returns {Router} A self-reference, suitable for chaining.
     */
    match(criteria: RouteCriteria | string, handler: RouteHandler): this;
    /**
     * Adds a route that matches all requests
     * @param {Function} handler A function that accepts a `WrappedResponse`, `Request`, and `params` object.
     * @returns {Router} A self-reference, suitable for chaining.
     */
    fallback(handler: RouteHandler): this;
    /**
     * Handles a request, sending the response by running the handler for each matched route.
     * @param req The request
     * @param res The response
     */
    run: (req: Request, res: Response) => Promise<void>;
    /**
     * Send a 404 response
     * @param response
     */
    private send404;
    /**
     * Returns edge config from current router
     * @private
     */
    createEdgeConfig(): import("../edge/types").EdgeConfig;
    /**
     * @private
     */
    getDestinations(): {
        [name: string]: Router;
    };
    /**
     * @private
     */
    getRouteGroups(): RouteGroupList;
    /**
     * Returns an object containing all of the TTLs for routes cached in the service worker.
     * Keys are route patterns, values are serviceWorkerSeconds.
     * @private
     */
    getCachedRoutes(): CacheManifestEntry[];
}
/**
 * Criteria for matching a request.
 */
export interface RouteCriteria {
    /**
     * Matches a request based on one or more header values. Keys are
     * case-insensitive header names, values are regular expressions to match.
     */
    headers: {
        [name: string]: RegExp;
    };
    /**
     * Matches a request based on one or more cookie values. Keys are
     * case-insensitive cookie names, values are regular expressions to match.
     */
    cookies: {
        [name: string]: RegExp;
    };
    /**
     * Matches a request based on the method.
     */
    method: RegExp;
    /**
     * Matches a request based on the path. The same path syntax is used by
     * the simple form of the Router classes's `match` method.
     */
    path: string;
}
export interface CacheManifestEntry {
    route: string;
    cacheOptions: CacheOptions;
}
export declare type RouteHandler = (respond: ResponseWriter) => void;
