export default interface ServerOptions {
    /**
     * The path to the custom RequestListener for the JS backend
     */
    path: string;
    /**
     * (Optional) The name of an exported function that, when called, returns a RequestListener
     */
    export?: string;
}
