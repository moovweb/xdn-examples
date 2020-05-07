/**
 * Replaces named parameters in the specified path with back references so
 * that the edge can create a path using the matched params with a regex replace in VCL.
 * @param matcher A route-parser route
 * @param path The request path
 * @returns A path with params replaced by back references
 */
export default function convertParamsToBackReferences(matcher: any, path: string): string;
