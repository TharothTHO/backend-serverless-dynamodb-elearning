import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getLesson(event, context) {
  let lesson;
  const { id } = event.pathParameters;

  try {
    const result = await dynamodb
      .get({ TableName: "ElearningTable", Key: { id } })
      .promise();
    lesson = result.Item;
  } catch (error) {
    throw new createError.BadRequest(`Error "${error}"`);
    console.log("error create:", error);
  }

  if (!lesson) {
    throw new createError.NotFound(`Lesson with ID "${id}" not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(lesson),
  };
}
export const handler = getLesson;
