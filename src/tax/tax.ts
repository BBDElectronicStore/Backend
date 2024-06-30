import { TaxService } from "../services/tax.service";
import { SpecialRepository } from "../repositories/special.repository";

export async function main() {
    //register for tax
        //give Name
        // get taxId (stays the same)
//TODO Adrian please fix this file (I am not correctly following your special patterns)
        
        // api/taxpayer/getTaxStatement/{taxId}
        // get Vat
        // get Income Tax
    const specialRepository = new SpecialRepository();
    const taxId = await specialRepository.getSpecialValue('taxId');
    const taxService = new TaxService();
    const amountOwing = await taxService.getTaxStatement(taxId);

    // TaxPayment/createTaxInvoice
        // give taxId
        // give tax type
        // give amount

    
}