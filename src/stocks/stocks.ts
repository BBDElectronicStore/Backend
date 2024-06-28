// import {sellStocks} from "./sell";
// import {buy} from "./buy";
// import {BankService} from "../services/bank.service";


// async function main() {
//     // register business and sell x% of shares

//     // allowance per job run
//     // try use "all" allowance
//     // 40% of current money = allowance for buying stocks
//     const budget = await new BankService().getCurrentBalance();

//     // Buy stocks that went down the most in value
//     buy(budget);
//     // Sell stocks that went up the most in price
//     sellStocks();
//     // get most recent val from table
//     // get new val
//     // update most recent val in table
// }

// main().then(() => {console.log("job finished")})