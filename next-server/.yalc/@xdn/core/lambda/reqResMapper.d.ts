/**
 * This file is modified version of: https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/next-aws-lambda/lib/compatLayer.js
 *
 * Mods:
 * - getHeader were only able to read lower case headers, but it was able to set upper case headers as well with writeHead,
 *   so all headers are converted to lowercase now.
 *
 * - Gzippes the response on response end if matches the content-type
 *
 * - Removed variable for base64 support since we always return base64 from the lambdas.
 */
declare const _default: (event: any, callback?: any) => {
    req: any;
    res: any;
    responsePromise: Promise<unknown> | undefined;
};
export default _default;
