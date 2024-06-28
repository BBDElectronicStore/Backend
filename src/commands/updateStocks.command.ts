import {ICommand} from "./ICommand";
import {StocksRepository} from "../repositories/stocks.repository";
import {Stocks} from "../interfaces/stocks";


export class UpdateStatusCommand implements ICommand<Promise<any>, [stocks: Stocks[]]> {

    constructor(private readonly repository: StocksRepository) {}

    async execute(stocks: Stocks[]) {
        if(!this.validate(stocks))
            throw new Error(`Invalid stocks`);
        return await this.repository.updateStocks(stocks);
    }

    validate(stocks: Stocks[]): boolean {
        return !(!stocks || stocks.length === 0);
    }
}