import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isZeusEnabled } from '../helpers/zeus_enabled_helper';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startFlag = await isZeusEnabled();
    if (!startFlag) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Zeus has not started yet.' }),
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'OK',
        }),
    };
};