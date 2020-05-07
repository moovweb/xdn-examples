"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _useIntersectionObserver = _interopRequireDefault(require("./useIntersectionObserver"));

var _window = require("@xdn/prefetch/window");

var _reactMergeRefs = _interopRequireDefault(require("react-merge-refs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
var Prefetch = (0, _react.forwardRef)(function (_ref, incomingRef) {
  var url = _ref.url,
      href = _ref.href,
      immediately = _ref.immediately,
      children = _ref.children,
      others = _objectWithoutProperties(_ref, ["url", "href", "immediately", "children"]);

  var ref = (0, _react.useRef)(null);

  var child = _react.Children.only(children);

  url = getPrefetchURL(url, child.props.href || href);
  (0, _useIntersectionObserver["default"])(function () {
    return immediately ? null : ref;
  }, function (visible, disconnect) {
    if (visible) {
      disconnect();
      (0, _window.prefetch)(url);
    }
  }, [url, immediately]);
  (0, _react.useEffect)(function () {
    if (immediately) {
      (0, _window.prefetch)(url);
    }
  }, [url, immediately]); // we use react-merge-refs here so that parent elements link Next.js's Link can pass a ref
  // down to the <a> child of this component

  return (0, _react.cloneElement)(child, _objectSpread({
    ref: (0, _reactMergeRefs["default"])([incomingRef, ref])
  }, others, {
    href: href
  }, child.props));
});
Prefetch.propTypes = {
  /**
   * Set to true to prefetch the URL immediately when the component mounts.  By default
   * the URL will be prefetched when the component becomes visible.
   */
  immediately: _propTypes["default"].bool,

  /**
   * The URL to prefetch. Or a function that takes the link's target URL and returns the URL to prefetch.
   * If omitted, this component assumes your page uses getServerSideProps and automatically derives the
   * URL based on next.js conventions.
   */
  url: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),

  /**
   * For use with Next.js. Do not use this prop directly. Instead specify the `passHref` prop on the parent
   * `<Link>` element so that Next.js passes this component the value of its `href` or `as` prop.
   */
  href: _propTypes["default"].string
};
Prefetch.defaultProps = {
  immediately: false
};
var _default = Prefetch;
exports["default"] = _default;

function getPrefetchURL(url, href) {
  if (typeof url === 'string') {
    return url;
  } else if (typeof url === 'function') {
    return url(href);
  } else if (typeof __NEXT_DATA__ !== 'undefined' && href) {
    return "/_next/data/".concat(__NEXT_DATA__.buildId).concat(href, ".json");
  } else {
    return href;
  }
}