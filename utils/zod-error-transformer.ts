import type { ZodError } from 'zod';
import type { APIError, RegisterKeys } from '../types';

export function transformZodError(err: ZodError): APIError {
  const errObject: APIError = { errors: {} };

  err.issues.forEach((issue) => {
    errObject.errors[issue.path[0] as typeof RegisterKeys[number]] =
      issue.message;
  });
  return errObject;
}
