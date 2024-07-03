import { GetSpecialQuery } from "../queries/getSpecial.query";
import { SpecialRepository } from "../repositories/special.repository";


//Create a function that will return a boolean value if the Zeus is enabled or not
export  const isZeusEnabled = async (): Promise<boolean> => {
    const command = new GetSpecialQuery(new SpecialRepository());
    const zeusEnabled = await command.execute('zeusEnabled');
  return zeusEnabled === 'true';
};