import { ResetQuery } from "../queries/reset.query";
import { ResetRepository } from "../repositories/reset.repository";


export async function main() {

    await new ResetQuery(new ResetRepository()).execute();

}
