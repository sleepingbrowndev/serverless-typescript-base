// import * as uuid from 'uuid';
// import { Context } from "aws-lambda";
// import { DynamoDB } from "aws-sdk";
import apiResponses from "../utils/api-response";
// const dynamoDb = new DynamoDB.DocumentClient();

module.exports.lambda_handler = async () => {
    try {
        return apiResponses._200({ sucess: true, result: 'id' });
    } catch (err: any) {
        console.log(err);
        return apiResponses._500({ success: false, result: err.toString() });
    }
};
