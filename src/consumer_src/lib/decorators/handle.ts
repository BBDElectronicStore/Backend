import {MessageHandler} from "../types/MessageHanlder";
import {Logger} from "../logger";
import {sendMessage} from "../../util/sendMessage";
import {ElectronicsStoreErrorConfig} from "../../config/electronics";

export const messageHandlers = new Map<string, MessageHandler>();

export function Handle(messageType: string) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                Logger.error(`Error handler for ${messageType}`);
                await sendMessage(args[0], `${messageType}_ERR`, ElectronicsStoreErrorConfig);
            }
        }
        messageHandlers.set(messageType, descriptor.value);
    }
}