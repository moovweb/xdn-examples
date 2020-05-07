import Response from '../router/Response';
/**
 * Replaces response.body with the unzipped body if the response has
 * a content-encoding: gzip header.  Will remove the content-encoding header
 * if present.  If content-encoding: gzip is not present, this method does nothing.
 * @param response
 */
export default function unzip(response: Response): void;
