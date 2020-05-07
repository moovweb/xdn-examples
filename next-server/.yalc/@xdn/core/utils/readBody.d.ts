import Request from '../router/Request';
/**
 * Reads the request body and adds it to request.body
 * @param req
 * @return {Promise}
 */
export default function readBody(req: Request): Promise<unknown>;
