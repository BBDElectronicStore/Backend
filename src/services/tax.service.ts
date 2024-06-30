export class TaxService {
    url = "someTaxURL";

    async registerForTax(businessName: string){
        try {
            const response = await fetch(`${this.url}/api/taxpayer/business/register`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({businessName})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.taxId;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async getTaxStatement(taxId: string){
        try {
            const response = await fetch(`${this.url}/api/taxpayer/getTaxStatement/${taxId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
             
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.amountOwing;
        }
        catch (e) {
            console.log(e);
            return -1;
        }
    }
}