import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import apiResponses from "../utils/api-response";
import { logger } from "../utils/utilities";
import ajvValidation from "../utils/validator";
import DynamoDbClient, { DynamoDbClientPutItemInput } from '../clients/ddbClient';
import { PayloadNotValidException } from "../utils/exceptions";


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
        data = await validateEvent(event);
    } catch (err: any) {
        logger.error(err);
        return apiResponses._400(
            { success: false, result: 'Payload validation failed' },
        );
    }

    // Construct the DDB Table record 
    logger.info(`Constructing DB Entry from ${JSON.stringify(data)}`);
    const ddbParam: DynamoDbClientPutItemInput = {
        _pk: data.id,
        _s: data.created_date,
        _data: {
            _name: data.name,
            _description: data.description,
            _due_date: data.due_date
        }
    };

    try {
        await ddbClient.putItem(ddbParam);
    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to create a todo', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });

    }

    //201
    return apiResponses._201({ sucess: true, result: 'Todo created' });
};

/**
 * Parse and validate the data coming in from the API Gateway event.
 * @param data 
 * @param event 
 * @returns 
 */
async function validateEvent(event: APIGatewayProxyEvent) {
    const data = event.body ? JSON.parse(event.body) : undefined;
    const schema = {
        type: "object",
        properties: {
            foo: { type: "integer" },
            bar: { type: "string" }
        },
        required: ["foo"],
        additionalProperties: false
    }

    // Validate and verify payload.
    if (data === undefined || !ajvValidation(schema, data)) {
        throw new PayloadNotValidException("Invalid payload");
    }
    logger.info(`Returning ${JSON.stringify(data)}`);
    return data;
}
