import {ICommand} from "./ICommand";
import {HelloRepository} from "../repositories/hello.repository";

/**
* Refer to the HelloConsumer to see how to call one of these commands
*/

/**
* @class HelloCommand
* @implements {ICommand<string>} ALWAYS IMPLEMENTS ICommand!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* ALWAYS implement the validate command and make usage of it in the execute method
* unless there is no data to validate, this is rare in commands but common
* @constructor should always inject the repository that it is going to be using dependency injection
* All commands should be doing something to modify the DB
* in other words they should be invoking methods in the relevant repositories
* that allow for update insert delete
* ie only commands that "change" data
* use this class as a template for all commands you code in the future
*/

export class HelloCommand implements ICommand<string> {

    constructor(private readonly repository: HelloRepository) {}

    execute(): string {
        if(this.validate())
            return this.repository.getHello();
        return 'invalid';
    }

    validate(): boolean {
        return true;
    }
}