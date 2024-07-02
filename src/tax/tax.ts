import { TaxService } from "../services/tax.service";
import { SpecialRepository } from "../repositories/special.repository";
import {GetSpecialQuery} from "../queries/getSpecial.query";

export async function main() {
    //register for tax
        //give Name
        // get taxId (stays the same)
        
        // api/taxpayer/getTaxStatement/{taxId}
        // get Vat
        // get Income Tax
    // Determine types please
    const command = new GetSpecialQuery(new SpecialRepository());
    const taxId = await command.execute('taxId');
    const taxService = new TaxService();
    const amountOwing = await taxService.getTaxStatement(taxId);

    // TaxPayment/createTaxInvoice
        // give taxId
        // give tax type
        // give amount

    
}