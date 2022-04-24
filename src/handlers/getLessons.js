import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getLessons(event, context) {
  let lessons;

  try {
    const result = await dynamodb
      .scan({ TableName: process.env.LESSONS_TABLE_NAME })
      .promise();
    lessons = result.Items;
  } catch (error) {
    throw new createError.BadRequest(`Error ${error}`);
    console.log("error create:", error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(lessons),
  };
}
export const handler = getLessons;
