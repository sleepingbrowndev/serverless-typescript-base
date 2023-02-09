// import * as uuid from 'uuid';
import { Context } from "aws-lambda";
// import { DynamoDB } from "aws-sdk";
import apiResponses from "../utils/api-response";
// const dynamoDb = new DynamoDB.DocumentClient();

module.exports.lambda_handler = async (event: any, context: Context) => {
    console.log("functionName", context.functionName);
    console.log(context);
    const body: object = JSON.parse(event.body);
    console.log(body);
    try {
        return apiResponses._200({ sucess: true, result: body });
    } catch (err: any) {
        console.log(err);
        return apiResponses._500({ success: false, result: err.toString() });
    }
};
