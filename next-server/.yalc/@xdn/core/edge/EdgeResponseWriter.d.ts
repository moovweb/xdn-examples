import Route from '../router/Route';
import { CacheOptions } from '../router/ResponseWriter';
import { EdgeRule } from './types';
import { ProxyOptions } from '../router/ResponseWriter';
/**
 * A substitute implementation of `ResponseWriter` that creates the contents of `xdn.json`, which
 * is used to generate edge code.
 */
export default class EdgeResponseWriter {
    readonly edgeConfig: EdgeRule;
    private route;
    stream: () => void;
    /**
     * @param req The `HttpRequest` object
     * @param res The `HttpResponse` object
     * @param route The route being hit
     * @param defaultBackend The default backend for proxy when none is provided
     */
    constructor(_req: any, _res: any, route: Route);
    setRequestHeader: (name: string, value: string) => void;
    updateRequestHeader: (name: string, match: RegExp, replace: string) => void;
    removeRequestHeader: (name: string) => void;
    setResponseHeader: (name: string, value: string) => void;
    updateResponseHeader: (name: string, match: RegExp, replace: string) => void;
    removeResponseHeader: (name: string) => void;
    /**
     * Sends a redirect from the edge
     * @param to The destination URL
     * @param statusCode The http response status.
     */
    redirect: (to: string, statusCode?: number) => void;
    /**
     * Serves static assets.
     * @param path The request path
     */
    serveStatic: (path: string) => void;
    /**
     * Proxies from the edge
     * @param backend
     * @param config
     * @param config.path
     */
    proxy: (backend: string, { path, transformResponse }?: ProxyOptions) => void;
    /**
     * Creates the edge cache config
     * @param config
     */
    cache: (config: CacheOptions) => void;
    /**
     * Sends string content back to client. If content is a string, the response will be sent
     * directly from the edge. If it is a function, the request will be computed by a JavaScript worker.
     * @param content The content to send to the browser
     * @param statusCode The HTTP status code
     * @param statusMessage The HTTP status message
     */
    send: (content: string | (() => string), statusCode?: number, statusMessage?: string | undefined) => void;
    /**
     * Passes request and response to the specified callback, which should
     * handle rendering the response as a string
     */
    render: () => void;
}
