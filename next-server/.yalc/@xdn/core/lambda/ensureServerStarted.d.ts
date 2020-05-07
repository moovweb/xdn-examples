import ServerConfig from './ServerConfig';
/**
 * Ensures that the specified server is listening on the port.  Resolves
 * when the server is listening.
 * @param server
 * @param port
 */
export default function ensureServerStarted(serverConfig: ServerConfig): Promise<unknown>;
