// import { Context } from 'aws-lambda';
import { logger } from "../utils/utilities";
import { SNS, CreateTopicInput, CreateTopicResponse, PublishInput, PublishResponse, SubscribeInput, SubscribeCommandOutput, UnsubscribeInput, UnsubscribeCommandOutput, DeleteTopicInput, DeleteTopicCommandOutput, ListTopicsInput, ListTopicsResponse, ListSubscriptionsInput, ListSubscriptionsResponse, ConfirmSubscriptionInput, ConfirmSubscriptionResponse } from '@aws-sdk/client-sns';

export default class SNSClient {
    sns: SNS;
    constructor() {
        this.sns = new SNS({});
    }

    async createTopic(input: CreateTopicInput): Promise<CreateTopicResponse> {
        try {
            logger.info(`Success[createTopic]: ${JSON.stringify(input)}`);
            return this.sns.createTopic(input);
        } catch (err: any) {
            logger.error('Error[createTopic]:', err);
            throw err;
        }
    }

    public async publish(input: PublishInput): Promise<PublishResponse> {
        try {
            logger.info(`Success[publish]: ${JSON.stringify(input)}`);
            return this.sns.publish(input);
        } catch (err: any) {
            logger.error('Error[publish]:', err);
            throw err;
        }
    }
    public async subscribe(input: SubscribeInput): Promise<SubscribeCommandOutput> {
        try {
            logger.info(`Success[subscribe]: ${JSON.stringify(input)}`);
            return this.sns.subscribe(input);
        } catch (err: any) {
            logger.error('Error[subscribe]:', err);
            throw err;
        }
    }

    public async unsubscribe(input: UnsubscribeInput): Promise<UnsubscribeCommandOutput> {
        try {
            logger.info(`Success[unsubscribe]: ${JSON.stringify(input)}`);
            return this.sns.unsubscribe(input);
        } catch (err: any) {
            logger.error('Error[unsubscribe]:', err);
            throw err;
        }
    }
    public async deleteTopic(input: DeleteTopicInput): Promise<DeleteTopicCommandOutput> {
        try {
            logger.info(`Success[deleteTopic]: ${JSON.stringify(input)}`);
            return this.sns.deleteTopic(input);
        } catch (err: any) {
            logger.error('Error[deleteTopic]:', err);
            throw err;
        }
    }

    public async listTopics(input: ListTopicsInput): Promise<ListTopicsResponse> {
        try {
            logger.info(`Success[listTopics]: ${JSON.stringify(input)}`);
            return this.sns.listTopics(input);
        } catch (err: any) {
            logger.error('Error[listTopics]:', err);
            throw err;
        }
    }
    public async listSubscriptions(input: ListSubscriptionsInput): Promise<ListSubscriptionsResponse> {
        try {
            logger.info(`Success[listSubscriptions]: ${JSON.stringify(input)}`);
            return this.sns.listSubscriptions(input);
        } catch (err: any) {
            logger.error('Error[listSubscriptions]:', err);
            throw err;
        }
    }

    public async confirmSubscription(input: ConfirmSubscriptionInput): Promise<ConfirmSubscriptionResponse> {
        try {
            logger.info(`Success[confirmSubscription]: ${JSON.stringify(input)}`);
            return this.sns.confirmSubscription(input);
        } catch (err: any) {
            logger.error('Error[confirmSubscription]:', err);
            throw err;
        }
    }

}