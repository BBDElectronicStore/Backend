import {ICommand} from "./ICommand";
import {StocksRepository} from "../repositories/stocks.repository";
import {Stock} from "../interfaces/stock";


export class UpdateStockCommand implements ICommand<Promise<any>, [stocks: Stock[]]> {

    constructor(private readonly repository: StocksRepository) {}

    async execute(stocks: Stock[]) {
        if(!this.validate(stocks))
            throw new Error(`Invalid stocks`);
        return await this.repository.updateStocks(stocks);
    }

    validate(stocks: Stock[]): boolean {
        return !(!stocks || stocks.length === 0);
    }
}