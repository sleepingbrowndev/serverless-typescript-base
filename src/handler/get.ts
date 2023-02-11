import apiResponses from "../utils/api-response";
import { logger } from "../utils/utilities";
import DynamoDbClient from '../clients/ddbClient';
const tableName: string = process.env.TABLE_NAME ?? 'undefined';
const ddbClient = new DynamoDbClient(tableName);

module.exports.lambda_handler = async (event: any) => {

    logger.appendKeys({
        resource_path: event.requestContext.resourcePath
    });

    const id = event.pathParameters!.id;
    if (id === undefined) {
        logger.warn('Missing \'id\' parameter in path while trying to retrieve a todo', {
            details: { eventPathParameters: event.pathParameters }
        });
        return apiResponses._400(
            { success: false, result: 'Missing \'id\' parameter in path' },
        );
    }
    try {
        let ddbParams = {
            _pk: id,
            _s: '',
        }
        const result = await ddbClient.getItem(ddbParams);

        if (!result) {
            logger.warn('No todo with ID ' + id + ' found in the databases while trying to retrieve a todo');
            // add 404
            return apiResponses._404(
                { success: false, result: 'Todo not found' },
            );
        }

        logger.info('Todo retrieved with ID ' + id, { details: { todo: result } });
        return apiResponses._200({ sucess: true, result: JSON.stringify(result) });

    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to retrieve a todo', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });

    }
};