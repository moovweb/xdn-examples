import Response from '../router/Response';
/**
 * Gzippes the response and sets the content-encoding header and returns the gzipped body when it matches the type defined above
 * Otherwise it will return the provided body without any additional header set.
 * @param res HttpResponse object
 * @param response Lambda response object
 */
declare const gzipResponse: (res: Response, response: any) => void;
export default gzipResponse;
