import {ICommand} from "./ICommand";
import {ProductRepository} from "../repositories/product.repository";


export class UpdatePriceCommand implements ICommand<Promise<number | null>, [newPrice: number]> {

    constructor(private readonly repository: ProductRepository) {}

    async execute(newPrice: number) {
        if(this.validate(newPrice))
            return await this.repository.updateProductPriceAndVAT(newPrice);
        return null;
    }

    validate(newPrice: number): boolean {
        if(!newPrice)
            return false;
        return !(newPrice < 0);
    }
}