import {IQuery} from "./IQeury";
import {ProductRepository} from "../repositories/product.repository";
import {Price} from "../interfaces/price";


export class GetPriceQuery implements IQuery<Promise<Price | null>, []> {

    constructor(private readonly repository: ProductRepository) {}

    async execute() {
        return await this.repository.getProductPriceAndVAT();
    }

    validate(): boolean {
        return true;
    }
}