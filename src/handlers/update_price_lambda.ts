import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {UpdatePriceCommand} from "../commands/updatePrice.command";
import {ProductRepository} from "../repositories/product.repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const command = new UpdatePriceCommand(new ProductRepository());
    if(!event.body)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' }),
        };
    const data = JSON.parse(event.body);
    if(!data.newPrice || !data.newVAT)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' }),
        };
    const result = await command.execute(data.newPrice, data.newVAT);
    if(result === null)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' }),
        };
    if(result === -1)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OK' }),
    };
};