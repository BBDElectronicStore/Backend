import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {Logger} from "../consumer_src/lib/logger";
import {PlaceOrderCommand} from "../commands/placeOrder.command";
import {OrderRepository} from "../repositories/order.repository";
import {sendMessage} from "../consumer_src/util/sendMessage";
import {payment} from "../consumer_src/interfaces/messages/payment";
import {PaymentMessage} from "../consumer_src/messages/payment.message";
import {ElectronicsStoreDefaultConfig} from "../consumer_src/config/electronics";
import {BankService} from "../services/bank.service";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const placeOrderCommand = new PlaceOrderCommand(new OrderRepository());
  if(event.body === null || event.body === undefined)
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad Request' }),
    }
  const data = JSON.parse(event.body);
  const result: { order_id: number, total_cost: number } | null = await placeOrderCommand.execute(data.customerId, data.quantity);

  if(result === null)
    return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error placing order' }),
    }

  const bankService = new BankService();
  const approved = await bankService.processPayment(result.total_cost, String(result.order_id), data.bankDetails);
  // Now await bank and check if payment valid
  if(!approved)
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Payment declined' }),
    }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK' }),
  }

}