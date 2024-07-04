// Registering for Tax Payments
    // Giving the Business Name
    // Getting the TaxID
import { StockService } from "../services/stock.service";
import { SpecialRepository } from "../repositories/special.repository";
import {SpecialValueCommand} from "../commands/specialValue.command";
import {ZeusService} from "../services/zeus.service";
import {UpdatePriceCommand} from "../commands/updatePrice.command";
import {ProductRepository} from "../repositories/product.repository";


export async function start() {
    const stockService = new StockService();
    const registrationResponse = await stockService.registerMyBusiness('Electronics', "electronics-retailer");
    if(registrationResponse) {
        if(registrationResponse.id !== "-1") {
            const command = new SpecialValueCommand(new SpecialRepository());
            await command.execute('StockId', registrationResponse.id);
        }
    }
    const service = new ZeusService();
    const price = await service.getPrice();
    const command = new UpdatePriceCommand(new ProductRepository());
    await command.execute(price.value, 15);
}