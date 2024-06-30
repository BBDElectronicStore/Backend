export class CommercialBankService {
    url = 'https://api.commercialbank.projects.bbdgrad.com';

    async getCurrentBalance(): Promise<number> {
        try {
            const response = await fetch(`${this.url}/account/balance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        }
        catch (e) {
            console.log(e);
            return -1;
        }
    }
    async getListOfTransactions(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/transactions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            return response.json();
        }
        catch (e) {
            console.log(e);
            return [];
        }
    }


}