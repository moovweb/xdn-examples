"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prefetchWhenVisible_1 = __importDefault(require("./prefetchWhenVisible"));
/**
 * Prefetches all current and future links whose href matches one of the
 * specified URL patterns
 * @param urlPatterns Regular expressions that will be tested against link href attributes
 */
function watchLinks(urlPatterns) {
    /* istanbul ignore next */
    if (typeof MutationObserver === 'undefined')
        return;
    var observer = new MutationObserver(function (mutationsList) {
        var e_1, _a;
        try {
            for (var mutationsList_1 = __values(mutationsList), mutationsList_1_1 = mutationsList_1.next(); !mutationsList_1_1.done; mutationsList_1_1 = mutationsList_1.next()) {
                var mutation = mutationsList_1_1.value;
                filterByHref(mutation.addedNodes, urlPatterns).forEach(prefetchWhenVisible_1.default);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (mutationsList_1_1 && !mutationsList_1_1.done && (_a = mutationsList_1.return)) _a.call(mutationsList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
    });
    filterByHref(document.querySelectorAll('a'), urlPatterns).forEach(prefetchWhenVisible_1.default);
}
exports.default = watchLinks;
/**
 * Returns all nodes in the node list whose href matches at least one of the specified patterns.
 * @param nodes A node list to filter
 * @param urlPatterns
 */
function filterByHref(nodes, urlPatterns) {
    return Array.from(nodes).filter(function (n) {
        if (n.nodeType === Node.ELEMENT_NODE) {
            var el_1 = n;
            return (el_1.tagName.toLowerCase() === 'a' &&
                urlPatterns.some(function (pattern) {
                    var url = el_1.getAttribute('href');
                    return url && pattern.test(url);
                }));
        }
    });
}
