
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleStocks } from "../stocks/stocks";
import { isZeusEnabled } from "../helpers/zeus_enabled_helper";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startFlag = await isZeusEnabled();
    if (!startFlag) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Zeus has not started yet.' }),
        }
    }
    try {
        await handleStocks();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Success' }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error' }),
        }
    }

}