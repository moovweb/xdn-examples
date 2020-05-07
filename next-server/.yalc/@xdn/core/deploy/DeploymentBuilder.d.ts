/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
import { Router } from '../router';
/**
 * The class helps you bundle apps for deployment on the Moovweb XDN.
 */
export default class DeploymentBuilder {
    private appDir;
    private xdnDir;
    private jsDir;
    private staticAssetsDir;
    private router?;
    constructor(appDir: string);
    /**
     * Logs a message to the console if process.env.debug is set to true
     * @param msg The message to log
     */
    log(...msg: any[]): void;
    /**
     * Runs a command.
     * @param path The path to the executable
     * @param args The arguments to pass
     * @param options Options for process.spawn
     * @return {Promise}
     */
    exec(path: string, args: string[], options: SpawnOptionsWithoutStdio): Promise<unknown>;
    /**
     * Adds an asset to the bundle for JavaScript workers
     * @param src The source path
     * @param dest The destination path within the lambda root directory
     * @return {XdnBuilder}
     */
    addJSAsset(src: string, dest?: string): this;
    /**
     * Adds a static asset.
     * @param src The source path
     * @param dest The destination path in s3
     * @return {XdnBuilder}
     */
    addStaticAsset(src: string, dest: string): this;
    /**
     * Ensures all assets in the `defaultAppPath` are either already present in the user's
     * app or are copied over from `defaultAppPath`.
     * @param defaultAppPath
     * @return A self reference, suitable for chaining
     */
    addDefaultAppResources(defaultAppPath: string): this;
    /**
     * Copies a file
     * @param from the source path
     * @param to the destination path
     */
    copySync(from: string, to: string): void;
    /**
     * Writes a file
     * @param to the destination path
     * @param content the contents of the file
     * @param encoding the encoding
     */
    writeFileSync(to: string, content: string, encoding?: string): void;
    /**
     * Deletes all files in a directory
     * @param dir The directory to empty
     */
    emptyDirSync(dir: string): void;
    /**
     * Reads a file
     * @param path the file path
     * @param options Options for `fs.readFileSync`
     * @returns The file contents
     */
    readFileSync(path: string, { encoding }?: {
        encoding?: string | undefined;
    }): string;
    /**
     * Deletes a file
     * @param path The file to delete
     */
    removeSync(path: string): void;
    /**
     * Deletes the output of the previous build.
     */
    clearPreviousBuildOutput(): this;
    /**
     * Returns the router instance.
     * @return {Router}
     */
    getRouter(): Promise<Router>;
    /**
     * Copies all of the standard assets into the JS and static asset bundles.  These are the same for any framework.
     */
    build(): Promise<void>;
    /**
     * Adds all dependencies from package.json to the JS bundle (excluding devDependencies)
     */
    includeNodeModules(): Promise<void>;
}
