"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ensures that the specified server is listening on the port.  Resolves
 * when the server is listening.
 * @param server
 * @param port
 */
function ensureServerStarted(serverConfig) {
    var name = serverConfig.name, port = serverConfig.port, server = serverConfig.server;
    var anyServer = server;
    if (!server || anyServer._isListening) {
        return Promise.resolve();
    }
    else {
        return new Promise(function (resolve, reject) {
            try {
                server.once('error', function () {
                    // Will only get here in serverless-offline because it resets the sandbox on every request, but doesn't free the port.
                    // We don't need to do anything here, but we do need to have this event listener so that serverless-offline
                    // will not shut down when listening fails
                    anyServer._isListening = true;
                    resolve();
                });
                server.once('listening', function () {
                    anyServer._isListening = true;
                    resolve();
                });
                server.listen(port, function () { return console.log("> Started " + name + " on port " + port); });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.default = ensureServerStarted;
