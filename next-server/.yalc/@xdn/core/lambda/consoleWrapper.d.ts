declare global {
    namespace NodeJS {
        interface Global {
            _xdnOriginalConsole: any;
            _xdnEnabledCount: number;
        }
    }
}
export default class ConsoleWrapper {
    constructor(mockLogger: any);
    static _assert(condition: boolean | undefined, ...args: any[]): void;
    static _dir(...args: any[]): void;
    static _trace(...args: any[]): void;
    static _time(label: string): void;
    static _timeEnd(label: string): void;
    static _timeLog(label: string, ...args: any[]): void;
    static enable(): void;
    static disable(): void;
}
