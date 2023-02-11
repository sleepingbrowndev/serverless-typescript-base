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
        logger.warn('Missing \'id\' parameter in path while trying to delete a todo', {
            details: { eventPathParameters: event.pathParameters }
        });
        return apiResponses._400(
            { success: false, result: 'Missing \'id\' parameter in path' },
        );
    }

    try {

        const ddbParams = {
            _pk: id,
            _sk: '',
        }
        await ddbClient.deleteItem(ddbParams);

        logger.info('Deleted todo with ID ' + id);
        return apiResponses._200({ sucess: true, result: 'todo deleted' });

    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to delete the todo', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });

    }
};