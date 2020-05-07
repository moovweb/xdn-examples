import Request from './Request';
import Response from './Response';
import BackendConfig from './BackendOptions';
/**
 * Proxies the request to the specified backend as a stream.  This can be used for event streams
 * for hot module reloading.
 * @param req The downstream request
 * @param res The downstream response
 * @param backendConfig The backend config from `xdn.config.js`
 * @param errorHandler A function to call when an error occurs
 */
export default function stream(req: Request, res: Response, backendConfig: BackendConfig, errorHandler: any): void;
