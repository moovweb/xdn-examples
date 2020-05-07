import BackendOptions from '../router/BackendOptions';
export interface EdgeConfig {
    version: string;
    backends: BackendOptions[];
    destinations: EdgeDestination[];
}
export interface EdgeDestination {
    index: number;
    routes: EdgeRule[];
}
export interface EdgeRule {
    path?: string;
    match?: EdgeRouteMatcher[];
    route?: EdgeRoute;
    cache?: EdgeCacheConfig;
    transform: {
        request: EdgeTransform[];
        response: EdgeTransform[];
    };
}
export interface EdgeRouteMatcher {
    value: string;
    matchRegex: string;
}
interface EdgeCacheConfig {
    maxAgeSeconds?: number;
    staleWhileRevalidateSeconds?: number;
    customKey?: any;
}
interface EdgeTransform {
    action: string;
    name?: string;
    value?: string;
    valueRegex?: string;
    replaceValue?: string;
}
interface EdgeRoute {
    action: string;
    statusCode?: number;
    statusMessage?: string;
    backend?: string;
    content?: string;
    fsPath?: string;
}
export {};
