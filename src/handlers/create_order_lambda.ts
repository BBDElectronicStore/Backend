import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {PlaceOrderCommand} from "../commands/placeOrder.command";
import {OrderRepository} from "../repositories/order.repository";
import {RetailBankService} from "../services/retail.bank.service";
import {PlaceOrder} from "../interfaces/placeOrder";
import {InsuranceService} from "../services/insurance.service";
import {UpdateStatusCommand} from "../commands/updateStatus.command";
import {GetSpecialQuery} from "../queries/getSpecial.query";
import {SpecialRepository} from "../repositories/special.repository";
import {Simulation} from "../helpers/time";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const placeOrderCommand = new PlaceOrderCommand(new OrderRepository());
    if(event.body === null || event.body === undefined)
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad Request' }),
    }
    const data = JSON.parse(event.body);
    console.log("incoming: ", data)
    const query = new GetSpecialQuery(new SpecialRepository());
    const value = await query.execute('startTime');
    const timeCalc = new Simulation(value);
    const time = timeCalc.updateDate();
    const result: PlaceOrder | null = await placeOrderCommand.execute(data.personaId, data.quantity, time.date);
    if(result === null) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Error placing order'}),
        }
    }

    const bankService = new RetailBankService();
    const approved = await bankService.processPayment(result.total_cost, String(result.order_id), data.personaId);
    // Now await bank and check if payment valid
    // const approved = true;
    if(!approved) {
        const command = new UpdateStatusCommand(new OrderRepository());
        await command.execute(String(result.order_id), 'denied');
        return {
              statusCode: 400,
              body: JSON.stringify({message: 'Payment declined'}),
        }
    }
    // Great payment was valid now let's insure!
    const insuranceService = new InsuranceService();
    console.log(data.personaId, result.total_cost)
    const insured = await insuranceService.insureElectronic(data.personaId, result.total_cost);
    if(!insured) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Error insuring order'}),
        }
    }
    const command = new UpdateStatusCommand(new OrderRepository());
    await command.execute(String(result.order_id), 'collected');
    return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'Success',
          orderRef: `electronics-${result.order_id}`,
      }),
    }

}