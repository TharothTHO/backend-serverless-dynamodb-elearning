import AWS from "aws-sdk";
import commonMiddleware from '../lib/commonMiddleware';
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getLessonById(id) {
  let lesson;

  try {
    const result = await dynamodb
      .get({ TableName: process.env.LESSONS_TABLE_NAME, Key: { id } })
      .promise();
    lesson = result.Item;
  } catch (error) {
    throw new createError.BadRequest(`Error "${error}"`);
    console.log("error create:", error);
  }

  if (!lesson) {
    throw new createError.NotFound(`Lesson with ID "${id}" not found!`);
  }
  return lesson;
}

async function getLesson(event, context) {
  const { id } = event.pathParameters;
  const lesson = await getLessonById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(lesson),
  };
}
export const handler = commonMiddleware(getLesson);
