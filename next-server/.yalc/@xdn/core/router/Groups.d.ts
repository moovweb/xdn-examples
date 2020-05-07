import GroupConfig from './GroupConfig';
export default class Groups {
    private groups;
    private name;
    group(name: string): GroupConfig;
    toJSON(): any[];
}
