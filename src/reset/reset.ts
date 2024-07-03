import { ResetCommand } from "../commands/reset.command";
import { ResetRepository } from "../repositories/reset.repository";


export async function reset() {

    await new ResetCommand(new ResetRepository()).execute();

}
