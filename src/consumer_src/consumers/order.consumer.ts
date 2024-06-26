import {Handle} from "../lib/decorators/handle";
import {IConsume} from "../lib/interfaces/IConsume";
import {OrderMessage} from "../messages/order.message";
import {sendMessage} from "../util/sendMessage";
import {ElectronicsStoreDefaultConfig} from "../config/electronics";
import {PlaceOrderCommand} from "../commands/placeOrder.command";
import {OrderRepository} from "../repositories/order.repository";
import {Logger} from "../lib/logger";
import {PaymentMessage} from "../messages/payment.message";
import {Order} from "../interfaces/messages/order";
import {payment} from "../interfaces/messages/payment";


export class OrderConsumer implements IConsume<Order, Order> {

    @Handle(OrderMessage.default)
    async successHandler(message: Order) {
        Logger.debug(`[${message.correlationId}] placing order for customer: ${message.customerId}`);
        const placeOrderCommand = new PlaceOrderCommand(new OrderRepository());
        const totalCost = await placeOrderCommand.execute(message.customerId, message.quantity, message.correlationId);

        if(totalCost === undefined)
            throw new Error(`[${message.correlationId}] Error placing order`);
        Logger.debug(`[${message.correlationId}] Order placed successfully with cost: ${totalCost}`);
        // send message to payment service with correlation guid
        await sendMessage<payment>(
            {
                totalCost: totalCost,
                orderRef: message.correlationId,
                bankDetails: message.bankDetails
            },
            PaymentMessage.default,
            ElectronicsStoreDefaultConfig
        )
    }

    @Handle(OrderMessage.err)
    async errorHandler(message: Order) {
        console.log("handling hello message err");
    }
}