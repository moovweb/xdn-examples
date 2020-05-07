/// <reference types="node" />
import { RequestListener } from 'http';
interface DevServerOptions {
    /**
     * The port on which to run the server.  Defaults to 3000.  The next two ports will
     * also be taken by the JS backend and assets backend, respectively
     */
    port?: number;
}
/**
 * Creates a development server to simulate the XDN locally.  Changes to your routes are automatically
 * applied without restarting `xdn run`.
 * @returns A promise that resolves when all servers are listening
 */
declare function createDevServer(): Promise<any>;
/**
 * Creates a development server to simulate the XDN locally.  Changes to your routes are automatically
 * applied without restarting `xdn run`.
 * @param server A node `RequestListener` callback that accepts request and response
 * @param options Additional options
 * @returns A promise that resolves when all servers are listening
 */
declare function createDevServer(options: DevServerOptions): Promise<any>;
/**
 * Creates a development server to simulate the XDN locally.  Changes to your routes are automatically
 * applied without restarting `xdn run`.
 * @param options Additional options
 * @returns A promise that resolves when all servers are listening
 */
declare function createDevServer(server: RequestListener, options: DevServerOptions): Promise<any>;
export default createDevServer;
