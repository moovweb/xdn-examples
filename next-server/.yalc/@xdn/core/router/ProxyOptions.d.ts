import Response from './Response';
export default interface ProxyOptions {
    path?: string;
    headers?: {
        name: string;
        value: string;
    };
    transformResponse?: (response: Response) => void;
}
