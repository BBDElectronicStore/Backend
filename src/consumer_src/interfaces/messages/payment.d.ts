import {BankDetails} from "./bankDetails";

export interface payment {
    totalCost: number;
    orderRef: string;
    bankDetails: BankDetails;
}