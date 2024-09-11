import * as Joi from 'joi';
import { auth_schema } from '@zimoykin/auth';
const schema = {
  MODE: Joi.string().valid('dev', 'prod'),
  PORT: Joi.number().min(3000).max(9000),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  ...auth_schema,
};
export const serviceSchema = Joi.object(schema);
export type ConfigVariables = typeof schema;
