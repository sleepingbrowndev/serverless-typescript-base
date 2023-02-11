import { AttributeValue, DynamoDB, GetItemInput, PutItemCommandOutput, PutItemInput, QueryCommandInput, DeleteItemInput, DeleteItemCommandOutput, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export default class DynamoDbClient {
    dynamoDB: DynamoDB;
    tableName: string;
    constructor(tableName: string) {
        this.dynamoDB = new DynamoDB({});
        this.tableName = tableName
    }

    async getItem<T>(inputKeys: DynamoDbClientGetItemInput): Promise<T | UnmarshalledAny> {
        const params: GetItemInput = {
            TableName: this.tableName,
            Key: marshall(inputKeys)
        };
        const result = await this.dynamoDB.getItem(params);
        if (!result || !result.Item) {
            return []
        }
        return unmarshall(result.Item)
    }

    async query<T>(input: Partial<QueryCommandInput>): Promise<T | UnmarshalledAny> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            ...input
        };
        const result = await this.dynamoDB.query(params);
        if (!result.Items) {
            return []
        }
        return this.unmarshallList(result.Items)
    }

    unmarshallList(items: MarshalledItem[]) {
        const unmarshalledItems = []
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            unmarshalledItems.push(unmarshall(item))
        }
        return unmarshalledItems
    }

    async putItem(inputItem: DynamoDbClientPutItemInput): Promise<PutItemCommandOutput> {
        const params: PutItemInput = {
            TableName: this.tableName,
            Item: marshall(inputItem, { removeUndefinedValues: true })
        };
        return await this.dynamoDB.putItem(params);
    }

    async deleteItem(deleteItem: DynamoDbClientDeleteItemInput): Promise<DeleteItemCommandOutput> {
        const params: DeleteItemInput = {
            TableName: this.tableName,
            Key: marshall(deleteItem)
        };
        return await this.dynamoDB.deleteItem(params);
    }

    async scanTable<T>(scanItem: Partial<ScanCommandInput>): Promise<T | UnmarshalledAny> {
        const params: ScanCommandInput = {
            TableName: this.tableName,
            ...scanItem
        };
        const result = await this.dynamoDB.scan(params);
        if (!result.Items) {
            return []
        }
        return this.unmarshallScanList(result.Items)
    }

    unmarshallScanList(items: MarshalledItem[]) {
        const unmarshalledItems = []
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            unmarshalledItems.push(unmarshall(item))
        }
        return unmarshalledItems
    }
}

export interface DynamoDbClientGetItemInput { _pk: string, _sk: string }
export interface DynamoDbClientPutItemInput { _pk: string, _sk: string, _data: any }
export interface DynamoDbClientDeleteItemInput { _pk: string, _sk: string }

export interface UnmarshalledAny {
    [key: string]: any;
}

export interface MarshalledItem {
    [key: string]: AttributeValue;
}
