import { existsSync } from 'fs';
import * as Joi from 'joi';
import { EnvValidationException } from '@app/common/exceptions';

export function validateEnvVariables(schema: Joi.ObjectSchema) {
  // Step 1: Check for `.env` file
  if (!existsSync('.env')) {
    console.error('No .env file found');
    throw new EnvValidationException('No .env file found');
  }

  // Step 2: Validate ENV variables using the provided Joi schema
  const { error } = schema.validate(process.env, { allowUnknown: true });

  if (error) {
    console.error(`ENV validation error: ${error.message}`);
    throw new EnvValidationException();
  }
}
