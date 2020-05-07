"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sends a message to the last focused browser window.
 * @param message
 */
function messageBrowser(message) {
    // @ts-ignore
    return self.clients.matchAll({ type: 'window' }).then(function (clients) {
        if (clients && clients.length) {
            // clients array is ordered by last focused
            clients[0].postMessage(message);
        }
    });
}
exports.default = messageBrowser;
