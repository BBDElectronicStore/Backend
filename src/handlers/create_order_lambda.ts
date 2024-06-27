import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {PlaceOrderCommand} from "../commands/placeOrder.command";
import {OrderRepository} from "../repositories/order.repository";
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