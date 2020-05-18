import {
  WorkboxPlugin,
  CachedResponseWillBeUsedCallbackParam,
  FetchDidSucceedCallbackParam,
  RequestWillFetchCallbackParam,
  CacheKeyWillBeUsedCallbackParam,
} from 'workbox-core/types'
import JSONP_QUERY_PARAM_WHITELIST from './JSONP_QUERY_PARAM_WHITELIST'

// api.searchspring.net/api/search/search.json
// ?callback=jQuery33106260311760293766_1589812270808
// &siteId=32wzjs
// &q=
// &resultsFormat=native
// &resultsPerPage=36
// &page=1
// &bgfilter.ss_is_ad=0
// &bgfilter.ss_hierarchy=New%20Arrivals%2FMens
// &_=1589812270809

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

  async cacheKeyWillBeUsed({ request, mode }: CacheKeyWillBeUsedCallbackParam) {
    if (request.url.match(/\/fetch-data/)) {
      const url = new URL(request.url)

      url.searchParams.forEach((value, key) => {
        if (!JSONP_QUERY_PARAM_WHITELIST.has(key)) {
          url.searchParams.delete(key)
        }
      })

      return new Request(url.toString(), request)
    } else {
      return request
    }
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
