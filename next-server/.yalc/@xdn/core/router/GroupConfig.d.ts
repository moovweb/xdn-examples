export default class GroupConfig {
    private name;
    private pattern?;
    constructor(name: string);
    byPattern(pattern: RegExp): void;
    toJSON(): any;
}
