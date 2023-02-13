import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import apiResponses from "../utils/api-response";
import { logger } from "../utils/utilities";
import DynamoDbClient from '../clients/ddbClient';

const tableName: string = process.env.TABLE_NAME ?? 'undefined';
const ddbClient = new DynamoDbClient(tableName);

/**
 * Handle the contract creation.
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    logger.appendKeys({
        resource_path: event.requestContext.resourcePath
    });

    let result;
    try {
        result = await ddbClient.scanTable({});
        logger.info('Todos retrieved', { details: { todo: result } });
    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to retrieve Todos', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });
    }

    return apiResponses._200({ sucess: true, result: JSON.stringify(result) });
};