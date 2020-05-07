import Request from './Request';
import Matcher from 'route-parser';
import { RouteCriteria, RouteHandler } from './Router';
/**
 * @private
 */
export default class Route {
    readonly criteria: RouteCriteria;
    readonly matcher?: Matcher;
    readonly handler: RouteHandler;
    /**
     * Creates a new Route
     * @param criteria A string or an object with `path`, `headers`, and `method`.
     * @param handler A route handler
     */
    constructor(criteria: string | RouteCriteria | null, handler: RouteHandler);
    /**
     * Returns params if route matches the request's method, headers, cookies and path.
     * @param req
     * @return true if the route matches the current request, otherwise false
     */
    match(req: Request): false | {
        [x: string]: string;
    };
    private matchPath;
    private matchMethod;
    private matchHeaders;
    private matchCookies;
    toString(): string;
    /**
     * Returns a string with the regex representation of the route.
     * @returns Regexp string representation of the route
     */
    toRegexString(): string;
}
