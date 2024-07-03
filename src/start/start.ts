// Registering for Tax Payments
    // Giving the Business Name
    // Getting the TaxID
import { StockService } from "../services/stock.service";
import { SpecialRepository } from "../repositories/special.repository";
import {SpecialValueCommand} from "../commands/specialValue.command";


export async function start() {
    const stockService = new StockService();
    const registrationResponse = await stockService.registerMyBusiness('Electronics', "electronics-retailer");
    if(registrationResponse) {
        const command = new SpecialValueCommand(new SpecialRepository());
        await command.execute('StockId', registrationResponse.id);
    }
}