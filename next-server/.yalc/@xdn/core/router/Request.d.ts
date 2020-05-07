/**
 * Represents an incoming request.
 */
export default interface Request {
    /**
     * The path and query string
     */
    url: string;
    /**
     * The request body as a string
     */
    body?: string;
    /**
     * The HTTP method
     */
    method?: string;
    /**
     * The request headers.  Keys are header names, values are either a string, or when multiple values for
     * the same header name are present, an array of strings.
     */
    headers: {
        [key: string]: string | string[];
    };
    /** @private */
    on: (event: string, callback: Function) => void;
}
