import { z } from 'zod';
import {
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../../../app/config/app.constants';

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(USER_NAME_MIN_LENGTH, 'validation.NAME_MIN_LENGTH')
    .max(USER_NAME_MAX_LENGTH, 'validation.NAME_MAX_LENGTH'),
  lastName: z
    .string()
    .min(USER_NAME_MIN_LENGTH, 'validation.NAME_MIN_LENGTH')
    .max(USER_NAME_MAX_LENGTH, 'validation.NAME_MAX_LENGTH')
    .optional(),
  email: z.email('validation.EMAIL_INVALID'),
  password: z
    .string('validation.PASSWORD_IS_REQUIRED')
    .min(USER_PASSWORD_MIN_LENGTH, 'validation.PASSWORD_MIN_LENGTH')
    .regex(/[a-z]/, 'validation.PASSWORD_LOWERCASE')
    .regex(/[A-Z]/, 'validation.PASSWORD_UPPERCASE')
    .regex(/[0-9]/, 'validation.PASSWORD_NUMBER')
    .regex(/[^A-Za-z0-9]/, 'validation.PASSWORD_SPECIAL'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
