import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {reset} from "../reset/reset";
import {start} from "../start/start";
import {status} from "../enum/status.enum";
import {Logger} from "../helpers/logger";
import {SpecialValueCommand} from "../commands/specialValue.command";
import {SpecialRepository} from "../repositories/special.repository";

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
        const command = new SpecialValueCommand(new SpecialRepository());
        await command.execute('zeusEnabled', 'false');
    }
    else if(instruction === status.start) {
        // Current issue with downstream service
        Logger.debug("start");
        await start();
        Logger.debug("start success");
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