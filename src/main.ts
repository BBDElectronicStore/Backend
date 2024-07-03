import {handler} from "./handlers/get_customer_orders_lambda";
import { handler as createOrder } from "./handlers/create_order_lambda";
import {APIGatewayProxyEvent} from "aws-lambda";

// To run tests
// npm run run
// test for get with path params
const mockEvent: Partial<APIGatewayProxyEvent> = {
    pathParameters: {
        personaId: '1'
    }
};

handler(mockEvent as APIGatewayProxyEvent)
    .then((res) => console.log(res))
    .catch((error) => console.error('Error:', error));

// Post request
createOrder({
    body: JSON.stringify({
        personaId: 1,
        quantity: 1,
        bankDetails: "my credit card"
    })
} as APIGatewayProxyEvent).then((res) => console.log(res)).catch((error) => console.error('Error:', error));