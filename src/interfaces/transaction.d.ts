export interface Transaction {
    transactionId: string;
    debitAccountName: string;
    creditAccountName: string;
    amount: number;
    status: string;
    debitRef: string;
    creditRef: string;
    date: string;
}