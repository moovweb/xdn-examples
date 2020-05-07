"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prefetch_1 = require("./prefetch");
/**
 * Prefetches a link's href when it is visible in the viewport
 * @param el The link element
 */
function prefetchWhenVisible(el) {
    /* istanbul ignore next */
    if (typeof IntersectionObserver === 'undefined')
        return;
    var observer = new IntersectionObserver(function (entries) {
        // if intersectionRatio is 0, the element is out of view and we do not need to do anything.
        if (entries[0].intersectionRatio > 0) {
            observer.disconnect();
            var url = el.getAttribute('href');
            if (url) {
                prefetch_1.prefetch(url);
            }
        }
    });
    // Note: apparently we don't need to clean these up when the observed node is removed.
    // See https://stackoverflow.com/questions/51106261/should-mutationobservers-be-removed-disconnected-when-the-attached-dom-node-is-r/51106262#51106262
    observer.observe(el);
}
exports.default = prefetchWhenVisible;
