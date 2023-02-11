import { Context } from 'aws-lambda';
import { logger } from "../utils/utilities";
import { SQS, SendMessageCommandOutput, ReceiveMessageResult, ReceiveMessageCommandOutput, Message } from '@aws-sdk/client-sqs';

export default class SQSClient {
    sqs: SQS;
    queueName: string;
    constructor(queueName: string) {
        this.sqs = new SQS({});
        this.queueName = queueName
    }

    async sendMessage(messageBody: string, messageAttributes = {}, context: Context): Promise<SendMessageCommandOutput> {
        const queueUrl = this.getQueueUrl(this.queueName, context)
        const params = {
            QueueUrl: queueUrl,
            MessageBody: messageBody,
            MessageAttributes: messageAttributes
        };
        return await this.sqs.sendMessage(params)
    }


    async getMessages(queueName: string, context: Context) {
        const queueUrl = this.getQueueUrl(queueName, context)
        const params = {
            AttributeNames: ["SentTimestamp"],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: ["All"],
            QueueUrl: queueUrl,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0
        };

        let messages: Message[] = [];
        try {
            const data: ReceiveMessageResult = await this.sqs.receiveMessage(params)
            console.log('ReceiveMessageResult', data);

            messages = data.Messages || [];

            // Delete messages we already received
            for (const message of messages) {
                console.log('Deleting Receipt:', message.ReceiptHandle)
                const deleteParams = {
                    QueueUrl: queueUrl,
                    ReceiptHandle: message.ReceiptHandle
                };

                this.sqs.deleteMessage(deleteParams, function (err: any, data) {
                    if (err) {
                        logger.error('Unexpected error occurred while trying to delete the message', err);
                    } else {
                        logger.info('Message Deleted', JSON.stringify(data));

                    }
                });
            }

        } catch (err: any) {
            logger.error('Unexpected SQS error', err);
        }
        console.log('messages', messages)
        return messages;
    }


    private getQueueUrl = (queueName: string, context: Context): string => {
        const region = context.invokedFunctionArn.split(':')[3];
        const accountId = context.invokedFunctionArn.split(':')[4];

        return `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`
    }

}