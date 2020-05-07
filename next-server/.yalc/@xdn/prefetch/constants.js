"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The name of the query parameter used to detect prefetch requests.
 *
 * Defaults to __prefetch__
 */
exports.PREFETCH_QUERY_PARAM = process.env.XDN_PREFETCH_QUERY_PARAM || '__prefetch__';
/**
 * The name of the prefetch cache.
 *
 * Defaults to `prefetch`.
 */
exports.CACHE_NAME = process.env.XDN_PREFETCH_CACHE_NAME || 'prefetch';
/**
 * The name of the header sent to indicate to the XDN that the request is a prefetch.  Defaults to `x-xdn-prefetch`.
 */
exports.PREFETCH_HEADER_NAME = process.env.PREFETCH_HEADER_NAME || 'x-xdn-prefetch';
/**
 * The value of the prefetch header. Defaults to `1`.
 */
exports.PREFETCH_HEADER_VALUE = process.env.XDN_PREFETCH_HEADER_VALUE || '1';
