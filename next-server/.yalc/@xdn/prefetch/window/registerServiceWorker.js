"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
var isSafari_1 = require("./isSafari");
function registerServiceWorker(serviceWorkerPath) {
    if (isSafari_1.isSafariPrivateWindow()) {
        // Private windows in safari have a known bug with sending cookies
        // in POST requests.  This often breaks cart and checkout, so we choose
        // not to use service workers at all when in safari private windows.
        // See the bug report here: https://bugs.webkit.org/show_bug.cgi?id=186617
        console.log('skipping service worker in Safari private window');
        unregisterServiceWorker();
        return;
    }
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            registerValidSW(serviceWorkerPath);
        });
    }
}
exports.registerServiceWorker = registerServiceWorker;
function registerValidSW(swUrl) {
    navigator.serviceWorker
        .register(swUrl)
        .then(function (registration) {
        registration.onupdatefound = function () {
            var installingWorker = registration.installing;
            if (!installingWorker)
                return;
            installingWorker.onstatechange = function () {
                console.log('[xdn service worker] state:', installingWorker.state);
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // At this point, the old content will have been purged and
                        // the fresh content will have been added to the cache.
                        // It's the perfect time to display a "New content is
                        // available; please refresh." message in your web app.
                        document.dispatchEvent(new CustomEvent('sw-update-available'));
                    }
                    else {
                        // At this point, everything has been precached.
                        // It's the perfect time to display a
                        // "Content is cached for offline use." message.
                        console.log('Content is cached for offline use.');
                    }
                }
            };
        };
    })
        .catch(function (error) {
        console.error('Error during service worker registration:', error);
    });
}
function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.unregister();
        });
    }
}
exports.unregisterServiceWorker = unregisterServiceWorker;
