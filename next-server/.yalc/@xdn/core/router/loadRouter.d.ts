/**
 * Loads and returns a router.  This function can accomodate:
 *
 * 1.) a routes file that uses `module.exports` or `export default`.
 * 2.) a routes file that exports a function using `module.exports` or `export default`.
 * 3.) a router instance
 * 4.) An object with a default key that is a router instance
 * 5.) An object with a default key whose value is a function that returns a router instance.
 *
 * @param {String} routerPath A path to routes.js,
 * @return {Router} The Router instance
 */
export default function loadRouter(router: any): any;
