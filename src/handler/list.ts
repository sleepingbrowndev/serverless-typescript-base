import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import apiResponses from "../utils/api-response";
import { logger } from "../utils/utilities";
import DynamoDbClient from '../clients/ddbClient';
const tableName: string = process.env.TABLE_NAME ?? 'undefined';
const ddbClient = new DynamoDbClient(tableName);

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    logger.appendKeys({
        resource_path: event.requestContext.resourcePath
    });

    try {
        const result = await ddbClient.scanTable({});

        logger.info('Todos retrieved', { details: { todo: result } });
        return apiResponses._200({ sucess: true, result: JSON.stringify(result) });

    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to retrieve Todos', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });
    }
};