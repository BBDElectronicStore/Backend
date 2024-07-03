// TODO: Register this handler
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCustomerOrderQuery } from "../queries/getAllCustomers.query";
import { CustomerRepository } from "../repositories/customer.repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const command = new GetCustomerOrderQuery(new CustomerRepository());
    const res = await command.execute();
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({
            message: 'OK',
            data: res
        }),
    };
};