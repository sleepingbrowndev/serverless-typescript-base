// import * as uuid from 'uuid';
// import { DynamoDB } from "aws-sdk";
import apiResponses from "../utils/api-response";
// const dynamoDb = new DynamoDB.DocumentClient();

module.exports.lambda_handler = async (event: any) => {
    const id: number = Number(event.pathParameters.id);
    const body: object = JSON.parse(event.body);

    console.log(body);
    console.log(id)
    try {
        return apiResponses._200({ sucess: true, result: body });
    } catch (err: any) {
        console.log(err);
        return apiResponses._500({ success: false, result: err.toString() });
    }
};
