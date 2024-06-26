import {messageHandlers} from "./lib/decorators/handle";
import {HelloConsumer} from "./consumers/hello.consumer";
import {listenToQueue} from "./lib/listen";
import {ElectronicsStoreDefaultConfig} from "./config/electronics";
import {OrderConsumer} from "./consumers/order.consumer";
import {PaymentConsumer} from "./consumers/payment.consumer";
import {CancelConsumer} from "./consumers/cancel.consumer";
import {send} from "./util/smtp";

/**
 * Please add your consumers to this array
 * Nothing gets done with the array, but we have to do this
 * Because javascript, IDK ask the guy who made it
 */
const consumers = [
    HelloConsumer,
    OrderConsumer,
    PaymentConsumer,
    CancelConsumer
];
send('adrianhawkins02@gmail.com',`Consumer is starting up🥳`, 'consumer starting up').then()
send('luke.bradford@bbd.co.za',`Consumer is starting up🥳`, 'consumer starting up').then()

process.on('SIGINT', () => {
    send('adrianhawkins02@gmail.com', 'Consumer is shutting down😔', 'Server Status Alert').then(() => {
        process.exit(0);
    });
    send('luke.bradford@bbd.co.za', 'Consumer is shutting down😔', 'Server Status Alert').then(() => {
        process.exit(0);
    });
});

listenToQueue(messageHandlers, ElectronicsStoreDefaultConfig).then();