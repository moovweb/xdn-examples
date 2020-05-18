import {
  WorkboxPlugin,
  CachedResponseWillBeUsedCallbackParam,
  FetchDidSucceedCallbackParam,
  RequestWillFetchCallbackParam,
} from 'workbox-core/types'

const transformResponse = async (req: Request, res: Response) => {
  if (req.url.match(/\/fetch-data/)) {
    let body = await res.text()
    const parsed = new URL(req.url)

    // read the callback name from the query string
    const jQueryCallback = parsed.searchParams.get('callback')

    // update the callback in the response to match the one in the query string
    if (jQueryCallback) {
      body = body.replace(/^jQuery[\d_]+/, jQueryCallback)
    }

    return new Response(body, res)
  } else {
    return res
  }
}

export default class CustomPlugin implements WorkboxPlugin {
  async cachedResponseWillBeUsed({
    request,
    cachedResponse,
  }: CachedResponseWillBeUsedCallbackParam) {
    if (cachedResponse) {
      return transformResponse(request, cachedResponse)
    } else {
      return cachedResponse
    }
  }

  async fetchDidSucceed({ request, response }: FetchDidSucceedCallbackParam) {
    return transformResponse(request, response)
  }

  /**
   * Indicates to the XDN that the request came from the service worker - this allows
   * us to deliver jsonp requests from the cache.
   */
  async requestWillFetch({ request }: RequestWillFetchCallbackParam) {
    const headers = new Headers(request.headers)
    headers.set('x-xdn-from-sw', '1')

    return new Request(request.url, {
      method: request.method,
      headers,
    })
  }
}
