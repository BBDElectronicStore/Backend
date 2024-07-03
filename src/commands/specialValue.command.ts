import {ICommand} from "./ICommand";
import {SpecialRepository} from "../repositories/special.repository";


export class SpecialValueCommand implements ICommand<Promise<boolean>, [key: string, value: string]> {

    constructor(private readonly repository: SpecialRepository) {}

    async execute(key: string, value: string) {
        if(!this.validate(key, value))
            throw new Error(`Invalid key ${key}`);
        return await this.repository.insertSpecialValue(key, value);

    }

    validate(key: string, value: string): boolean {
        return !!((key && key.length > 0) && (value && value.length > 0));

    }
}