import {Handle} from "../lib/decorators/handle";
import {HelloMessage} from "../messages/hello.message";
import {IConsume} from "../lib/interfaces/IConsume";
import {HelloCommand} from "../commands/hello.command";
import {HelloRepository} from "../repositories/hello.repository";


/**
 * @class HelloConsumer
 * @implements {IConsume} 
 * @interface IConsume is always implemented to ensure consumers handle messages correctly
 * We should be handling a success message and an error message
 * Messages should always be refering to an enum in the messages folder which have a default and err message
 * @enum HelloMessage is used in this case with its default and err message
 * error message handling TBD
 */

export class HelloConsumer implements IConsume<any, any> {

    @Handle(HelloMessage.default)
    async successHandler(message: any) {
        const command = new HelloCommand(new HelloRepository());
        if(true) {
            throw new Error("Error");
        }
        return `${command.execute()} ${message.content}`;
    }

    // Do we need error queues to replay messages pushed to the error queue
    @Handle(HelloMessage.err)
    async errorHandler(message: any) {
        console.log("handling hello message err");
    }
}