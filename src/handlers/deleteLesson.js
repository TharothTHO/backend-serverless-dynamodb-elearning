import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getLesson(event, context) {
  const { id } = event.pathParameters;

  try {
    await dynamodb
      .delete({ TableName: "ElearningTable", Key: { id } })
      .promise();
  } catch (error) {
    throw new createError.BadRequest(`Error "${error}"`);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Lesson deleted successfully" }),
  };
}
export const handler = getLesson;
