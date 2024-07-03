import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdatePriceCommand } from "../commands/updatePrice.command";
import { ProductRepository } from "../repositories/product.repository";
import { isZeusEnabled } from '../helpers/zeus_enabled_helper';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startFlag = await isZeusEnabled();
    if (!startFlag) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Zeus has not started yet.' }),
        }
    }
    const command = new UpdatePriceCommand(new ProductRepository());
    if (!event.body)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' }),
        };
    const data = JSON.parse(event.body);
    if (!data.newPrice || !data.newVAT)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' }),
        };
    const result = await command.execute(data.newPrice);
    if (result === null)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' }),
        };
    if (result === -1)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OK' }),
    };
};