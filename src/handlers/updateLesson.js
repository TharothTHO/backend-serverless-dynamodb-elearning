import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateLesson(event, context) {
  const { id } = event.pathParameters;
  const { title } = JSON.parse(event.body);
  const { description } = JSON.parse(event.body);

  const params = {
    TableName: process.env.LESSONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set title = :title, description = :description",
    ExpressionAttributeValues: { ":title": title, ":description": description },
    ReturnValues: "ALL_NEW",
  };
  let updateLesson;
  try {
    const result = await dynamodb.update(params).promise();
    updateLesson = result.Attributes;
  } catch (error) {
    throw new createError.BadRequest(`Error "${error}"`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updateLesson),
  };
}
export const handler = updateLesson;
