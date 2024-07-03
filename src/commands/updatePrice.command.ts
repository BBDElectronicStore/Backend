import {ICommand} from "./ICommand";
import {ProductRepository} from "../repositories/product.repository";


export class UpdatePriceCommand implements ICommand<Promise<number | null>, [newPrice: number, newVat: number]> {

    constructor(private readonly repository: ProductRepository) {}

    async execute(newPrice: number, newVat: number) {
        if(this.validate(newPrice, newVat))
            return await this.repository.updateProductPriceAndVAT(newPrice, newVat);
        return null;
    }

    validate(newPrice: number, newVat: number): boolean {
        if(!newPrice)
            return false;
        return !(newPrice < 0);
    }
}