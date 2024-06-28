import {sell} from "./sell";
import {buy} from "./buy";
import {BankService} from "../services/bank.service";
// import {StockService} from "../services/sotck.service";
// import {GetStocksQuery} from "../queries/getStocks.query";
import {StocksRepository} from "../repositories/stocks.repository";
import {StockService} from "../services/stock.service";
import {GetStocksQuery} from "../queries/getStock.query";
import {UpdateStockCommand} from "../commands/updateStock.command";
// import {UpdateStatusCommand} from "../commands/updateStocks.command";


export async function main() {
    // register business and sell x% of shares

    // allowance per job run
    // try use "all" allowance
    // 40% of current money = allowance for buying stocks
    const budget = await new BankService().getCurrentBalance();

    const oldStock = await new GetStocksQuery(new StocksRepository()).execute()
    console.log(oldStock)
    const stocks = await new StockService().getStocks();
    console.log(stocks)
    // Buy stocks that went down the most in value
    await buy(budget);
    // Sell stocks that went up the most in price
    await sell();
    // get most recent val from table
    // get new val
    // update most recent val in table

    // Now we have to update the stocks table with the new values
    const command = new UpdateStockCommand(new StocksRepository());
    await command.execute(stocks);
}
