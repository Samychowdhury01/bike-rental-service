import { z } from 'zod';
import { role } from './user.constant';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .optional(),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email({
        message: 'Invalid email',
      })
      .optional(),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .optional(),
    phone: z
      .string({
        required_error: 'Phone is required',
        invalid_type_error: 'Phone must be a string',
      })
      .optional(),
    address: z
      .string({
        required_error: 'Address is required',
        invalid_type_error: 'Address must be a string',
      })
      .optional(),
    role: z
      .enum([...role] as [string, ...string[]], {
        required_error: 'Role is required',
      })
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const userValidationSchemas = {
  updateUserValidationSchema,
};
