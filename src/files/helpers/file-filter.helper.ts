import { Request } from 'express';

export const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!validExtensions.includes(fileExtension))
    return callback(new Error('File extension is not valid'), false);

  callback(null, true);
};
