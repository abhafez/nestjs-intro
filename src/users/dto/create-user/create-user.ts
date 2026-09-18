import { z } from 'zod';
import { USER_NAME_MAX_LENGTH, USER_NAME_MIN_LENGTH } from '../../../app/config/app.constants';

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
  email: z.string('validation.EMAIL_REQUIRED').email('validation.EMAIL_INVALID'),
  password: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
