import {Logger} from "../lib/logger";
export function getEnv(key: string) {
    const value = process.env[key];
    if (!value) {
        Logger.error(`No ${key.toLowerCase().replace(/_/g, ' ')} specified. Exiting`);
        process.exit(1);
    }
    return value;
}