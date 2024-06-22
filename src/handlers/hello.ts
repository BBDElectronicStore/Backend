import {APIGatewayProxyEvent, Context} from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        const body = JSON.parse(event.body || '{}');

        const result = `Hello, ${body.name || 'World'}!`;

        return {
            statusCode: 200,
            body: JSON.stringify({message: result}),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
}