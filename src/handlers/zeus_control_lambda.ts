import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {reset} from "../reset/reset";
import {start} from "../start/start";
import {status} from "../status.enum";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if(event.body === null || event.body === undefined)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' }),
        }
    const data = JSON.parse(event.body);
    const instruction = data.status || "";
    if(instruction === status.reset) {
        await reset();
    }
    else if(instruction === status.start) {
        await start();
    }
    else {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'invalid status' }),
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'OK',
        }),
    };
};