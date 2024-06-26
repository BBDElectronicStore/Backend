import {getEnv} from "./getEnv";
import {IConfig} from "./IConfig";

export const ElectronicsStoreDefaultConfig: IConfig = {
    MAIN_QUEUE: getEnv('MAIN_QUEUE'),
    QUEUE_URL: getEnv('QUEUE_URL'),
    REGION: getEnv('REGION'),
    ACCESS_KEY_ID: getEnv('ACCESS_KEY_ID'),
    SECRET_ACCESS_KEY: getEnv('SECRET_ACCESS_KEY')
}

export const ElectronicsStoreErrorConfig: IConfig = {
    MAIN_QUEUE: 'error',
    QUEUE_URL: getEnv('QUEUE_URL'),
    REGION: getEnv('REGION'),
    ACCESS_KEY_ID: getEnv('ACCESS_KEY_ID'),
    SECRET_ACCESS_KEY: getEnv('SECRET_ACCESS_KEY')
}