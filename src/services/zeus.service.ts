import {BankDetails} from "../interfaces/bankDetails";

export class ZeusService {
    url = 'https://api.zeus.projects.bbdgrad.com';

    async getPrice() {
        try {
            const response = await fetch(`${this.url}/electronics-price`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.price;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}