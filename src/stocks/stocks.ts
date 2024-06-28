import {sellStocks} from "./sell";
import {buy} from "./buy";
import {BankService} from "../services/bank.service";
import {StockService} from "../services/sotck.service";
import {GetStocksQuery} from "../queries/getStocks.query";
import {StocksRepository} from "../repositories/stocks.repository";
import {UpdateStatusCommand} from "../commands/updateStocks.command";


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
    buy(budget);
    // Sell stocks that went up the most in price
    sellStocks();
    // get most recent val from table
    // get new val
    // update most recent val in table

    // Now we have to update the stocks table with the new values
    const command = new UpdateStatusCommand(new StocksRepository());
    await command.execute(stocks);
}

// main().then(() => {console.log("job finished")})