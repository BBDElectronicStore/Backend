import {Handle} from "../lib/decorators/handle";
import {IConsume} from "../lib/interfaces/IConsume";
import {PaymentMessage} from "../messages/payment.message";
import {payment} from "../interfaces/messages/payment";
import {BankService} from "../../services/bank.service";
import {Logger} from "../lib/logger";
import {DenyOrderCommand} from "../commands/denyOrder.command";
import {OrderRepository} from "../../repositories/order.repository";
import {FulfilOrderCommand} from "../commands/fulfilOrderCommand";
import {GetStatusQuery} from "../queries/getStatus.query";
import {PendOrderCommand} from "../commands/pendOrder.command";


export class PaymentConsumer implements IConsume<payment, payment> {

    @Handle(PaymentMessage.default)
    async successHandler(message: payment) {
        const query = new GetStatusQuery(new OrderRepository());
        const status = await query.execute(message.orderRef);
        if(status !== "placed") {
            Logger.error(`[${message.orderRef}] Order status is ${status}. Cannot process payment.`);
            return;
        }
        const bankService = new BankService();
        Logger.debug(`[${message.orderRef}] processing payment for order`);
        await bankService.processPayment(message.totalCost, message.orderRef, message.bankDetails);
        const command = new PendOrderCommand(new OrderRepository());
        await command.execute(message.orderRef);
    }

    @Handle(PaymentMessage.err)
    async errorHandler(message: payment) {
        console.log("handling hello message err");
    }
}