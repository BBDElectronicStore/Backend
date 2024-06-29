export class CommercialBankService {
    url = 'https://api.commercialbank.projects.bbdgrad.com';

    async getCurrentBalance(): Promise<number> {
        return 5000;
    }

}