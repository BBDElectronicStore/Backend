import {IRepository} from "./IRepository";

/**
 * @class HelloRepository
 * @implements {IRepository}
 * This is where all our data base transactions will occur
 * ie if I want to update the "hello" table or get anything from the "hello" table
 * DO IT HERE!
 */

export class HelloRepository implements IRepository {
    public getHello() {
        return 'Hello';
    }
}