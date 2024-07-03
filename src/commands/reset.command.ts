import {IQuery} from "../queries/IQeury";
import { ResetRepository } from "../repositories/reset.repository";


export class ResetCommand implements IQuery<Promise<void>> {

    constructor(private readonly repository: ResetRepository) {}

    async execute() {
        return await this.repository.resetDatabase();
    }

    validate(): boolean {
        return true;
    }
}