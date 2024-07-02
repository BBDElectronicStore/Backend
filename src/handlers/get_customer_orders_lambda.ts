import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {GetCustomerOrderQuery} from "../queries/getCustomerOrder.query";
import {OrderRepository} from "../repositories/order.repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const personaId = event.pathParameters?.personaId;

  if (!personaId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request: personaId is required' }),
    };
  }
  const command = new GetCustomerOrderQuery(new OrderRepository());
  const res = await command.execute(personaId);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
      data: res
    }),
  };
};