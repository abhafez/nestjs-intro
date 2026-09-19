import { ValidationError } from '@nestjs/common';

/** A single field's flattened, translated validation errors. */
export interface FieldError {
  /** Dot-path of the invalid field, e.g. `address.city`. */
  field: string;
  /** Translated error messages for this field. */
  messages: string[];
}

/**
 * Flattens Nest's nested {@link ValidationError} tree into a flat list of
 * {@link FieldError}, recursing into `children` for nested DTOs.
 * @param errors validation errors produced by class-validator
 * @param parentPath dot-path prefix used while recursing into children
 * @returns one entry per invalid field, in `field`/`messages` form
 */
export function formatValidationErrors(errors: ValidationError[], parentPath = ''): FieldError[] {
  return errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;
    const ownErrors = error.constraints ? [{ field, messages: Object.values(error.constraints) }] : [];
    const childErrors = error.children?.length ? formatValidationErrors(error.children, field) : [];
    return [...ownErrors, ...childErrors];
  });
}
