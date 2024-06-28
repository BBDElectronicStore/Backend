import {IQuery} from "./IQeury";
import {StocksRepository} from "../repositories/stocks.repository";
import {Stocks} from "../interfaces/stocks";


export class GetStocksQuery implements IQuery<Promise<Stocks[]>> {

    constructor(private readonly repository: StocksRepository) {}

    async execute() {
        return await this.repository.getStocks();
    }

    validate(): boolean {
        return true;
    }
}