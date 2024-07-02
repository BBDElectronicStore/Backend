
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleStocks } from "../stocks/stocks";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        
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