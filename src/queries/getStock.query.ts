import {IQuery} from "./IQeury";
import {StocksRepository} from "../repositories/stocks.repository";
import {Stock} from "../interfaces/stock";


export class GetStocksQuery implements IQuery<Promise<Stock[]>> {

    constructor(private readonly repository: StocksRepository) {}

    async execute() {
        return await this.repository.getStocks();
    }

    validate(): boolean {
        return true;
    }
}