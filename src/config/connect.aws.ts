import aws from 'aws-sdk';

const endpoint = new aws.Endpoint(process.env.BUCKET_ENDPOINT!);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.BUCKET_KEY_ID!,
    secretAccessKey: process.env.BUCKET_APPLICATION_KEY!,
  },
});

const uploadImage = async (path: any, buffer: any, mimeType: any) => {
  const image = await s3
    .upload({
      Bucket: process.env.BUCKET_KEY_NAME!,
      Key: path,
      Body: buffer,
      ContentType: mimeType,
    })
    .promise();

  return {
    path: image.Key,
    url: `https://${process.env.BUCKET_KEY_NAME}.${process.env.BUCKET_ENDPOINT}/${image.Key}`,
  };
};

const findImage = async (id) => {
  const image = await s3
    .listObjects({
      Bucket: process.env.BUCKET_KEY_NAME!,
      Prefix: `produtos/${id}`,
    })
    .promise();
  return image.Contents;
};

const deleteImage = async (path) => {
  await s3
    .deleteObject({
      Bucket: process.env.BUCKET_KEY_NAME!,
      Key: path,
    })
    .promise();
};

export default {
  uploadImage,
  findImage,
  deleteImage,
};
