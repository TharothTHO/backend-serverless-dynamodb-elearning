import { v1 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createLesson(event, context) {
  const { title } = JSON.parse(event.body);
  const { description } = JSON.parse(event.body);
  const now = new Date();

  const Lesson = {
    id: uuid(),
    title,
    description,
    status: "publish",
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: "ElearningTable",
        Item: Lesson,
      })
      .promise();
  } catch (error) {
    throw new createError.BadRequest(`Error ${error}`);
    console.log("error create:", error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(Lesson),
  };
}
export const handler = createLesson;
