import {BankDetails} from "./bankDetails";

export interface Order {
    quantity: number;
    customerId: number;
    bankDetails: BankDetails;
    correlationId: string;
}