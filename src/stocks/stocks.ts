import {sell} from "./sell";
import {buy} from "./buy";
import {RetailBankService} from "../services/retail.bank.service";
// import {StockService} from "../services/sotck.service";
// import {GetStocksQuery} from "../queries/getStocks.query";
import {StocksRepository} from "../repositories/stocks.repository";
import {StockService} from "../services/stock.service";
import {GetStocksQuery} from "../queries/getStock.query";
import {UpdateStockCommand} from "../commands/updateStock.command";
import { CommercialBankService } from "../services/commercial.bank.service";
// import {UpdateStatusCommand} from "../commands/updateStocks.command";


export async function main() {
    // register business and sell x% of shares

    // allowance per job run
    // try use "all" allowance
    // 40% of current money = allowance for buying stocks

    const currentBalance = await new CommercialBankService().getCurrentBalance();
    const budget = Math.floor(currentBalance * 0.40);

    const oldStock = await new GetStocksQuery(new StocksRepository()).execute()
    console.log(oldStock)
    const stocks = await new StockService().getStocks();
    console.log(stocks)
    // Buy stocks that went down the most in value
    await buy(budget, stocks, oldStock);
    // Sell stocks that went up the most in price
    await sell(oldStock, stocks);
    // get most recent val from table
    // get new val
    // update most recent val in table

    // Now we have to update the stocks table with the new values
    const command = new UpdateStockCommand(new StocksRepository());
    await command.execute(stocks);
}
