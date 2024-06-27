import {IQuery} from "./IQeury";
import {ProductRepository} from "../repositories/product.repository";


export class GetPriceQuery implements IQuery<Promise<string>, []> {

    constructor(private readonly repository: ProductRepository) {}

    async execute() {
        return await this.repository.getProductPriceAndVAT();
    }

    validate(): boolean {
        return true;
    }
}