import apiResponses from "../utils/api-response";
import { logger } from "../utils/utilities";
import DynamoDbClient from '../clients/ddbClient';
const tableName: string = process.env.TABLE_NAME ?? 'undefined';
const ddbClient = new DynamoDbClient(tableName);

export interface ToDo {
    id: string;
    name: string;
    description: string;
    due_date: string;
    created_date: string;
}

module.exports.lambda_handler = async (event: any) => {

    logger.appendKeys({
        resource_path: event.requestContext.resourcePath
    });

    const id = event.pathParameters!.id;
    if (id === undefined) {
        logger.warn('Missing \'id\' parameter in path while trying to create a todo', {
            details: { eventPathParameters: event.pathParameters }
        });

        return apiResponses._400(
            { success: false, result: 'Missing \'id\' parameter in path' },
        );
    }

    if (!event.body) {
        logger.warn('Empty request body provided while trying to create a todo');
        return apiResponses._400(
            { success: false, result: 'Empty request body' },
        );
    }

    let todo: ToDo;
    try {
        todo = JSON.parse(event.body);

        if ((typeof todo) !== "object") {
            throw Error("Parsed todo is not an object")
        }
    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to create a todo', err);
        return apiResponses._400(
            { success: false, result: 'Failed to parse todo from request body"' },
        );
    }

    if (id !== todo.id) {
        logger.error(`todo ID in path ${id} does not match todo ID in body ${todo.id}`);
        return apiResponses._400(
            { success: false, result: 'todo ID in path does not match todo ID in body' },
        );
    }

    try {
        let ddbParams = {
            _pk: todo.id,
            _sk: todo.created_date,
            _data: {
                _name: todo.name,
                _description: todo.description,
                _due_date: todo.due_date
            }
        }
        await ddbClient.putItem(ddbParams);

        //201
        return apiResponses._200({ sucess: true, result: 'todo created' });

    } catch (err: any) {
        logger.error('Unexpected error occurred while trying to create a todo', err);
        return apiResponses._500({ success: false, result: JSON.stringify(err) });

    }
};
