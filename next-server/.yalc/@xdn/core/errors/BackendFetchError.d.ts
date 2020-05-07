/**
 * To be thrown when failing to connect to a backend.
 */
export default class BackendFetchError extends Error {
    readonly cause: Error;
    readonly type = "BackendFetchError";
    /**
     * @param {Error} cause The root error emitted by http/https.request
     */
    constructor(cause: Error);
}
