export const getBucketToken = (bucketName: string) =>
  `S3_BUCKET_${bucketName.toUpperCase()}`;
