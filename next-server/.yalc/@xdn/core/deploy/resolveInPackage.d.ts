/**
 * Returns the path to a file within a node package
 * @param pkg The name of a node package
 * @param file The path to the file within the package
 * @return A file path
 */
export default function resolveInPackage(pkg: string, ...file: string[]): string;
