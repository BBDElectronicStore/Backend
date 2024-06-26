import { AWSError, SQS } from 'aws-sdk';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';

const sqs = new SQS();
const queueUrl = process.env.SQS_QUEUE_URL;

export const PublishMessage = async (object: any) => {
    if (!queueUrl) {
        throw new Error('SQS_QUEUE_URL is not defined');
    }

    const params: SendMessageRequest = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(object),
    };

    return await new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err: AWSError, data: any) => {
            if (err) {
                reject(Error(err.message));
            } else {
                resolve(data)
            }
        })
    });

};

