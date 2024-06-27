import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {GetCustomerOrderQuery} from "../queries/getCustomerOrder.query";
import {OrderRepository} from "../repositories/order.repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if(event.body === null || event.body === undefined)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' }),
    }
  const data = JSON.parse(event.body);
  const command = new GetCustomerOrderQuery(new OrderRepository());
  const res = await command.execute(data.personaId);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
      data: res
    }),
  };
};