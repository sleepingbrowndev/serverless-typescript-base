import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import apiResponses from "../utils/api-response";
import { logger } from "../utils/utilities";
import DynamoDbClient, { DynamoDbClientGetItemInput } from '../clients/ddbClient';
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
    logger.info(`Constructing DB Get from ${JSON.stringify(data)}`);
    const ddbParam: DynamoDbClientGetItemInput = {
        _pk: data,
        _s: ''
    };

    let result;
    try {
        result = await ddbClient.getItem(ddbParam);
        if (!result) {
            logger.warn('No todo with ID ' + data + ' found in the databases while trying to retrieve a todo');
            return apiResponses._404(
                { success: false, result: 'Todo not found' },
            );
        }
        logger.info('Todo retrieved with ID ' + data, { details: { todo: result } });
    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to retrieve a todo', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });

    }

    return apiResponses._200({ sucess: true, result: JSON.stringify(result) });
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