import BackendConfig from './BackendOptions';
import Request from './Request';
import Response from './Response';
/**
 * @private
 */
export interface FetchOptions {
    path?: string;
    headers?: Headers;
    disableCheckCert?: boolean;
}
/**
 * @private
 */
export default class Backend {
    private config;
    constructor(config: BackendConfig);
    /**
     * Sends a request using the proxy.
     * @param req The request being sent.
     * @param res The response for the request.
     */
    fetch(req: Request, res: Response, options: FetchOptions): Promise<unknown>;
    /**
     * Returns proxy configuration for http-proxy
     * @returns proxy target url
     */
    private getProxyTarget;
    /**
     * Returns proxy configuration object for node-fetch
     * @param url
     * @param req
     * @param headers Additional request headers to include
     */
    private getProxyRequestOptions;
}
/**
 * @private
 */
declare type Headers = {
    [key: string]: string;
};
/**
 * @private
 */
export interface FetchOptions {
    path?: string;
    headers?: Headers;
    disableCheckCert?: boolean;
}
export {};
