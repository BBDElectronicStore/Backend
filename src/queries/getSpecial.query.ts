import {IQuery} from "./IQeury";
import {SpecialRepository} from "../repositories/special.repository";


export class GetSpecialQuery implements IQuery<Promise<string>, [key:string]> {

    constructor(private readonly repository: SpecialRepository) {}

    async execute(key: string) {
        return await this.repository.getSpecialValue(key);
    }

    validate(key: string): boolean {
        return true;
    }
}