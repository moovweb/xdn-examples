"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var waitForServiceWorker_1 = __importDefault(require("./waitForServiceWorker"));
var activeColor = '#4caf50';
var inactiveColor = '#f44336';
var wrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '6px',
    backgroundColor: 'white',
    border: '2px solid #666',
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    padding: '4px',
    fontSize: '12px',
};
var lightStyles = {
    borderRadius: '50%',
    backgroundColor: inactiveColor,
    width: '12px',
    height: '12px',
    marginRight: '4px',
};
var labelStyles = {
    color: '#444',
    fontWeight: 'bold',
};
var contentStyles = {
    display: 'flex',
    alignItems: 'center',
};
function getStatsInfo(stats) {
    var hits = stats.hits, misses = stats.misses;
    var total = hits + misses;
    if (total) {
        var perc = Math.floor((hits / total) * 100);
        return hits + " hits, " + misses + " misses (" + perc + "%)";
    }
    else {
        return 'no data yet';
    }
}
/**
 * Creates an indicator element that resides in the lower right of the screen
 * and shows information about how the service worker is working
 */
function createIndicator() {
    var label = document.createElement('div');
    label.innerHTML = 'service worker';
    Object.assign(label.style, labelStyles);
    var light = document.createElement('div');
    light.setAttribute('id', 'xdn_sw_indicator_light');
    Object.assign(light.style, lightStyles);
    var stats = document.createElement('div');
    stats.setAttribute('id', 'xdn_sw_indicator_stats');
    stats.innerHTML = 'loading...';
    var content = document.createElement('div');
    content.appendChild(light);
    content.appendChild(stats);
    Object.assign(content.style, contentStyles);
    var wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'xdn_sw_indicator');
    wrapper.setAttribute('title', 'Moovweb XDN service worker is inactive.');
    wrapper.appendChild(label);
    wrapper.appendChild(content);
    Object.assign(wrapper.style, wrapperStyles);
    document.body.appendChild(wrapper);
    waitForServiceWorker_1.default().then(function (controller) {
        light.style.backgroundColor = activeColor;
        wrapper.setAttribute('title', 'Moovweb XDN service worker is active!');
        navigator.serviceWorker.addEventListener('message', function (event) {
            if (event.data.type === 'stats') {
                stats.innerHTML = getStatsInfo(event.data.stats);
            }
        });
        controller.postMessage({ action: 'get-stats' });
    });
    return wrapper;
}
exports.default = createIndicator;
