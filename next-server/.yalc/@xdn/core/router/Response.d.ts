/// <reference types="node" />
/**
 * Represents an outgoing response.
 */
export default interface Response {
    /**
     * The HTTP status code
     */
    statusCode?: number;
    /**
     * The HTTP status message
     */
    statusMessage?: string;
    /**
     * The response body as a string
     */
    body?: string | Buffer;
    /**
     * Writes the response header
     * @param statusCode The HTTP status code
     * @param headers Response headers to send.
     */
    writeHead: (statusCode: number, statusMessageOrHeaders?: Headers | string, headers?: Headers) => void;
    /**
     * Sends the response
     */
    end: (body?: string | Buffer) => void;
    /**
     * Sets a header
     * @param name The name of the header to set
     * @param value The value to set
     */
    setHeader: (name: string, value: any) => void;
    /**
     * Gets the value of a header
     * @param name The name of the header to return
     * @returns The value of the header
     */
    getHeader: (name: string) => string;
    /**
     * Gets all headers as key/value pairs.
     */
    getHeaders: () => {
        [name: string]: string[];
    };
    /**
     * Removes a header
     * @param name The header to remove
     */
    removeHeader: (name: string) => void;
}
declare type Headers = {
    [key: string]: string;
};
export {};
