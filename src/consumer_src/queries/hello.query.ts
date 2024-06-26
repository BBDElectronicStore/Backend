import {IQuery} from "./IQeury";

/**
 * @description Please see the @class HelloCommand for more information
 * commands and queries are very similar
 */
export class HelloQuery implements IQuery<string> {
    execute(): string {
        return 'undefined';
    }

    validate(): boolean {
        return false;
    }
}