import middy from '@middy/core';
import  httpErrorHandler  from '@middy/http-error-handler';
import createError from 'http-errors';
import { getLessonById } from './getLesson';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setLessonPictureUrl } from '../lib/setLessonPictureUrl';

export async function uploadLessonPicture(event) {
  const { id } = event.pathParameters;
  const lesson = await getLessonById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, "base64");
  let updatedLesson;
  try {
    const pictureUrl = await uploadPictureToS3(lesson.id + '.jpg', buffer);
    updatedLesson = await setLessonPictureUrl(lesson.id, pictureUrl);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedLesson),
  };
}
export const handler = middy(uploadLessonPicture).use(httpErrorHandler());
