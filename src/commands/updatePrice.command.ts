import {ICommand} from "./ICommand";
import {ProductRepository} from "../repositories/product.repository";


export class UpdatePriceCommand implements ICommand<Promise<number | null>, [newPrice: number, newVAT: number]> {

    constructor(private readonly repository: ProductRepository) {}

    async execute(newPrice: number, newVAT: number) {
        if(this.validate(newPrice, newVAT))
            return await this.repository.updateProductPriceAndVAT(newPrice, newVAT);
        return null;
    }

    validate(newPrice: number, newVAT: number): boolean {
        if(!newPrice || !newVAT)
            return false;
        return !(newPrice < 0 || newVAT < 0);
    }
}