import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {GetPriceQuery} from "../queries/getPrice.query";
import {ProductRepository} from "../repositories/product.repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const query = new GetPriceQuery(new ProductRepository());
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OK' }),
    };
};