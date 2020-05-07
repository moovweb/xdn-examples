"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adds preload headers for all `<link rel="preload">` tags on the response.body
 * @private
 * @param res The response to which headers should be added.
 */
function addPreloadHeaders(res) {
    if (/text\/html/i.test(res.getHeader('Content-Type'))) {
        var body = res.body;
        var matches = [];
        var preloadRegex = /<link rel="preload" href="([^"]*)"/gis;
        var match = void 0;
        if (typeof body === 'string') {
            while ((match = preloadRegex.exec(body))) {
                matches.push(match[1]);
            }
        }
        var newLinks = matches.map(linkFile).join(', ');
        // Add to existing links if exist
        var existingLinks = res.getHeader('link');
        if (existingLinks) {
            res.setHeader('link', existingLinks + ", " + newLinks);
        }
        else if (newLinks.length) {
            res.setHeader('link', newLinks);
        }
    }
}
exports.default = addPreloadHeaders;
/**
 * Creates a preload header value for the specified file
 * @param uri The request uri
 * @private
 */
function linkFile(uri) {
    var name = uri.split('?')[0];
    var as = 'script';
    if (name.toLowerCase().endsWith('.css')) {
        as = 'style';
    }
    return "<" + name + ">; as=" + as + "; rel=preload";
}
