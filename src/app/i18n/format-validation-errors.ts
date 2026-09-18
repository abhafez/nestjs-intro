import { ValidationError } from '@nestjs/common';

export interface FieldError {
  field: string;
  messages: string[];
}

export function formatValidationErrors(errors: ValidationError[], parentPath = ''): FieldError[] {
  return errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;
    const ownErrors = error.constraints ? [{ field, messages: Object.values(error.constraints) }] : [];
    const childErrors = error.children?.length ? formatValidationErrors(error.children, field) : [];
    return [...ownErrors, ...childErrors];
  });
}
