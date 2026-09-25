import { resource } from "./resource";
import { version } from "./version";

export interface ApiConfig {
    name: string;
    descripcio: string;
    host: string;
    port: number;
    status: string;
    version: version; // 1.0.0
    resources: resource[];
}