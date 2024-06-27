// TODO: Register this handler
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {GetAllOrdersQuery} from "../queries/getAllOrders.query";
import {OrderRepository} from "../repositories/order.repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const command = new GetAllOrdersQuery(new OrderRepository());
    const res = await command.execute();
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'OK',
            data: res
        }),
    };
};