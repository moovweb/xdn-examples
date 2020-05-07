/**
 * @private
 */
export default interface BackendOptions {
    domainOrIp: string;
    hostHeader?: string;
    basePath?: string;
    port?: number;
    disableCheckCert?: boolean;
    firstByteTimeout?: number;
}
