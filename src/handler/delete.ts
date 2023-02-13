import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import apiResponses from "../utils/api-response";
import { logger } from "../utils/utilities";
import DynamoDbClient, { DynamoDbClientDeleteItemInput } from '../clients/ddbClient';
import { QueryStringParametersException } from "../utils/exceptions";

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

    // Assemble from payload
    let data;
    try {
        data = await validateParameters(event);
    } catch (err: any) {
        logger.error(err);
        return apiResponses._400(
            { success: false, result: 'Payload validation failed' },
        );
    }

    // Construct the DDB Table record 
    logger.info(`Constructing DB Delete for ${JSON.stringify(data)}`);
    const ddbParam: DynamoDbClientDeleteItemInput = {
        _pk: data,
        _s: ''
    };

    try {
        await ddbClient.deleteItem(ddbParam);
        logger.info('Deleted todo with ID ' + data);
    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to delete the todo', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });
    }

    return apiResponses._200({ sucess: true, result: 'Todo deleted' });
};

/**
 * Parse and validate the data coming in from the API Gateway event.
 * @param data 
 * @param event 
 * @returns 
 */
async function validateParameters(event: APIGatewayProxyEvent) {
    if (!event.pathParameters?.id) {
        throw new QueryStringParametersException("Id is required");
    }
    const data = event.pathParameters?.id!;
    logger.info(`Returning ${JSON.stringify(data)}`);
    return data;
}