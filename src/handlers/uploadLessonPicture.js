import { getLessonById } from './getLesson';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';

export async function uploadLessonPicture(event) {
  const { id } = event.pathParameters;
  const lesson = await getLessonById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  const uploadToS3Result = await uploadPictureToS3(lesson.id + '.jpg', buffer);
  console.log(uploadToS3Result);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}
export const handler = uploadLessonPicture;
