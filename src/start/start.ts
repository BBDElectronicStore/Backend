// TODO this is run when our system starts up for the first time?
// ?? This includes
// Registering for Stock Exchange
    // Getting and saving the BusinessID we get
// Registering for Tax Payments
    // Giving the Business Name
    // Getting the TaxID


import { ResetQuery } from "../queries/reset.query";
import { ResetRepository } from "../repositories/reset.repository";
import { StockService } from "../services/stock.service";
import { RegisterStock } from "../interfaces/registerStock";
import { SpecialRepository } from "../repositories/special.repository";


export async function main() {
    // Register for Stock Exchange
    const stockService = new StockService();
    let registrationResponse = await stockService.registerMyBusiness('Electronics', "electronics-retailer");

    if(registrationResponse) {
        const specialRepository = new SpecialRepository();
        await specialRepository.insertSpecialValue('StockId', registrationResponse.id);  // store the StockId in the special table of the DB
    }
}