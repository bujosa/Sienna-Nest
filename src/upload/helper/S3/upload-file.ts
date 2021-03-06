import { v4 as uuid } from 'uuid';
import { S3, Endpoint } from 'aws-sdk';
import { removeBackgroundFromImageBuffer } from '../bg-image/remove-background-from-image-buffer';

export const uploadFileHelper = async (
  file: Express.Multer.File,
): Promise<string> => {
  file.buffer = await removeBackgroundFromImageBuffer(file.buffer);

  const spacesEndpoint = new Endpoint(process.env.SPACE_ENDPOINT);
  const s3 = new S3({ endpoint: spacesEndpoint });
  const fileName = `${Date.now()}-${uuid()}.${file.originalname
    .split('.')
    .pop()}`;

  const upload = await s3
    .upload(
      {
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer,
        Key: fileName,
        ACL: 'public-read',
      },
      (err) => {
        if (err) {
        }
      },
    )
    .promise();
  return upload.Location;
};
