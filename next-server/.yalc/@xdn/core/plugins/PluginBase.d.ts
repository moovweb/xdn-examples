import Request from '../router/Request';
import { Router } from '../router';
/**
 * Base class for a router plugin.
 */
export default class PluginBase {
    /**
     * Called when plugin is registered
     * @param router The router object to which the plugin was added.
     */
    onRegister(router: Router): void;
    /**
     * Called when `router.run` receives a request.
     * @param req The request object
     */
    onRequest(req: Request): void;
}
