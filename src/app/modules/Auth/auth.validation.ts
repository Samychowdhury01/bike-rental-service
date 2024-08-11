import { z } from 'zod';
import { role } from '../user/user.constant';


const signupValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email({
        message: 'Invalid email',
      }),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
    phone: z.string({
      required_error: 'Phone is required',
      invalid_type_error: 'Phone must be a string',
    }),
    address: z.string({
      required_error: 'Address is required',
      invalid_type_error: 'Address must be a string',
    }),
    role: z.enum([...role] as [string, ...string[]]),
    isDeleted: z.boolean().optional(),
  }),
});

export const SignupValidationSchemas = {
  signupValidationSchema,
};
