"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useIntersectionObserver;

var _react = require("react");

/**
 * Calls a provided callback when the provided element moves into or out of the viewport.
 *
 * Example:
 *
 * ```js
 *  import React, { useRef, useCallback } from 'react'
 *  import useIntersectionObserver from '@xdn/next/hooks/useIntersectionObserver'
 *
 *  function MyComponent() {
 *    const ref = useRef(null)
 *
 *    const onVisibilityChange = useCallback((visible, disconnect) => {
 *      if (visible) {
 *        // do some side effect here
 *        // and optionally stop observing by calling: disconnect()
 *      }
 *    }, [])
 *
 *    useIntersectionObserver(() => ref, onVisibilityChange, [])
 *    return <div ref={ref}></div>
 *  }
 * ```
 *
 * @param {Function} getRef A function that returns a ref pointing to the element to observe
 * @param {Function} cb A callback to call when visibility changes
 * @param {Object[]} deps The IntersectionObserver will be updated to observe a new ref whenever any of these change
 */
function useIntersectionObserver(getRef, cb, deps) {
  (0, _react.useEffect)(function () {
    var ref = getRef();

    if (ref && ref.current) {
      var observer = new IntersectionObserver(function (entries) {
        // if intersectionRatio is 0, the element is out of view and we do not need to do anything.
        cb(entries[0].intersectionRatio > 0, function () {
          return observer.disconnect();
        });
      });
      observer.observe(ref.current);
      return function () {
        return observer.disconnect();
      };
    }
  }, deps);
}