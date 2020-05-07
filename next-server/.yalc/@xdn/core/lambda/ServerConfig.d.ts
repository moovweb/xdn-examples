/// <reference types="node" />
import { Server } from 'http';
export default interface ServerConfig {
    name: string;
    port: number;
    server: Server;
}
