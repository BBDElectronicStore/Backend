import {Handle} from "../lib/decorators/handle";
import {IConsume} from "../lib/interfaces/IConsume";
import {payment} from "../interfaces/messages/payment";
import {Logger} from "../lib/logger";
import {OrderRepository} from "../../repositories/order.repository";
import {Cancel} from "../interfaces/messages/cancel";
import {CancelMessage} from "../messages/cancel.message";
import {CancelOrderCommand} from "../commands/cancelOrder.command";


export class CancelConsumer implements IConsume<Cancel, Cancel> {

    @Handle(CancelMessage.default)
    async successHandler(message: Cancel) {
        const command = new CancelOrderCommand(new OrderRepository());
        await command.execute(message.orderRef);
        Logger.debug(`[${message.orderRef}] Order cancelled`);
    }

    @Handle(CancelMessage.err)
    async errorHandler(message: Cancel) {
        console.log("handling hello message err");
    }
}