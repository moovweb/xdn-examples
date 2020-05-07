import webpack from 'webpack';
/**
 * Compiles the router in production mode.
 */
export default function bundle(): Promise<unknown>;
/**
 * Creates a webpack compiler for bundling the router in development.
 * @private
 */
export declare function createCompiler(): webpack.Compiler;
/**
 * @private
 */
export declare const ROUTER_DESTINATION: string;
