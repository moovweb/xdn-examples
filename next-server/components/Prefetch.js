/* global __NEXT_DATA__ */
import { useRef, useEffect, cloneElement, Children, forwardRef } from 'react'
import PropTypes from 'prop-types'
import useIntersectionObserver from './useIntersectionObserver'
import { prefetch as doPrefetch } from '@xdn/prefetch/window'
import mergeRefs from 'react-merge-refs'

/**
 * Wrap this component around any `<a>` or Next.js `<Link>` link element to prefetch the data for the linked page
 * when the link becomes visible.
 *
 * Example:
 *
 * ```js
 *  import { Prefetch } from '@xdn/react'
 *
 *  <Prefetch>
 *    <a href="/p/1">
 *      {product.name}
 *    </a>
 *  </Prefetch>
 * ```
 *
 * When used in Next.js, this component assumes your pages use `getServerSideProps` and
 * automatically derives the URL to prefetch based on Next.js conventions.  If you want to prefetch a
 * different URL, set the `url` prop.
 *
 * Example:
 *
 * ```js
 *  import { Prefetch } from '@xdn/react'
 *  import Link from 'next/link'
 *
 *  <Link href="/p/[productId]" as={`/p/${product.id}`} passHref>
 *    <Prefetch url={`/api/p/${product.id}`}>
 *      <a>{product.name}</a>
 *    </Prefetch>
 *  </Link>
 * ```
 *
 * When using Next.js, take care to ensure that the anchor element either has an href prop, or the Next Link element
 * has the passHref prop so that the Prefetch element knows which URL to prefetch.
 *
 * You can also provide a function for the `url` prop to derive the URL to prefetch from
 * the link's `href`.  For example:
 *
 * ```js
 *  import { Prefetch } from '@xdn/react'
 *
 *  <Prefetch url={href => `/api${href}`}>
 *    <a href="/p/1">{product.name}</a>
 *  </Prefetch>
 * ```
 */
const Prefetch = forwardRef(({ url, href, immediately, children, ...others }, incomingRef) => {
  const ref = useRef(null)
  const child = Children.only(children)
  url = getPrefetchURL(url, child.props.href || href)

  useIntersectionObserver(
    () => (immediately ? null : ref),
    (visible, disconnect) => {
      if (visible) {
        disconnect()
        doPrefetch(url)
      }
    },
    [url, immediately]
  )

  useEffect(() => {
    if (immediately) {
      doPrefetch(url)
    }
  }, [url, immediately])

  // we use react-merge-refs here so that parent elements link Next.js's Link can pass a ref
  // down to the <a> child of this component
  return cloneElement(child, {
    ref: mergeRefs([incomingRef, ref]),
    ...others,
    href, // href is placed here before child props so that the child element's href property is not overwritten by an undefined href prop value from this element.
    ...child.props,
  })
})

Prefetch.propTypes = {
  /**
   * Set to true to prefetch the URL immediately when the component mounts.  By default
   * the URL will be prefetched when the component becomes visible.
   */
  immediately: PropTypes.bool,

  /**
   * The URL to prefetch. Or a function that takes the link's target URL and returns the URL to prefetch.
   * If omitted, this component assumes your page uses getServerSideProps and automatically derives the
   * URL based on next.js conventions.
   */
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /**
   * For use with Next.js. Do not use this prop directly. Instead specify the `passHref` prop on the parent
   * `<Link>` element so that Next.js passes this component the value of its `href` or `as` prop.
   */
  href: PropTypes.string,
}

Prefetch.defaultProps = {
  immediately: false,
}

export default Prefetch

function getPrefetchURL(url, href) {
  if (typeof url === 'string') {
    return url
  } else if (typeof url === 'function') {
    return url(href)
  } else if (typeof __NEXT_DATA__ !== 'undefined' && href) {
    return `/_next/data/${__NEXT_DATA__.buildId}${href}.json`
  } else {
    return href
  }
}
