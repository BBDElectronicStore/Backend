import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import {MessageHandler} from "./types/MessageHanlder";
import { Logger } from "./logger";
import {IConfig} from "../config/IConfig";

export async function listenToQueue(handlers: Map<string, MessageHandler>,config: IConfig){
    const sqsClient = new SQSClient({
        region: config.REGION,
        endpoint: config.QUEUE_URL,
        credentials: {
            accessKeyId: config.ACCESS_KEY_ID,
            secretAccessKey: config.SECRET_ACCESS_KEY
        }
    });

    const queueUrl = `${config.QUEUE_URL}/queue/${config.MAIN_QUEUE}`;
    Logger.debug(`Listening to queue: ${config.QUEUE_URL}`);
        while (true) {
            try {
                const receiveParams = {
                    QueueUrl: queueUrl,
                    MaxNumberOfMessages: 1,
                    WaitTimeSeconds: 20,
                };

                const receiveCommand = new ReceiveMessageCommand(receiveParams);
                const { Messages } = await sqsClient.send(receiveCommand);

                if (Messages && Messages.length > 0) {
                    const message = Messages[0];
                    const messageBody = JSON.parse(message.Body || '{}');
                    const messageName = messageBody.name || 'Unnamed Message';
                    const messageContent = messageBody.content;
                    const correlationId = message.MessageId;

                    Logger.debug(`[${correlationId}] ${messageName}`);
                    Logger.debug(`[${correlationId}] Body: ${JSON.stringify(messageContent)}`);

                    const handler = handlers.get(messageName);
                    if (handler) {
                        try {
                            await handler({
                                ...messageContent,
                                correlationId: correlationId,
                            });
                        } catch (error) {
                            Logger.error(`Error processing message[${correlationId}]: ${error}`);
                        }
                    } else {
                        // What should we do if the handler is not found?
                        Logger.error(`No handler found for message: ${messageName}`);
                    }

                    const deleteCommand = new DeleteMessageCommand({
                        QueueUrl: queueUrl,
                        ReceiptHandle: message.ReceiptHandle,
                    });
                    await sqsClient.send(deleteCommand);
                }
            } catch (error) {
                Logger.error(`Error listening to queue: ${error}`);
            }
        }

}