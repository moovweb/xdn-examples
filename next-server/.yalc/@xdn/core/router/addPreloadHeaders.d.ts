import Response from './Response';
/**
 * Adds preload headers for all `<link rel="preload">` tags on the response.body
 * @private
 * @param res The response to which headers should be added.
 */
export default function addPreloadHeaders(res: Response): void;
