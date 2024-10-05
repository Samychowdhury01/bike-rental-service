import { z } from 'zod';

const createBikeValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be string format',
      })
      .min(1, { message: 'Name is required' }),
    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be string format',
      })
      .min(1, { message: 'Description is required' }),
    pricePerHour: z
      .number({
        required_error: 'Price per hour is required',
        invalid_type_error: 'Price per hour must be number format',
      })
      .positive({ message: 'Price per hour must be a positive number' }),
    isAvailable: z
      .boolean({ message: 'Availability status is required' })
      .optional(),
    cc: z
      .number({
        required_error: 'CC is required',
        invalid_type_error: 'CC must be number format',
      })
      .positive({ message: 'CC must be a positive number' }),
    year: z.number({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a number',
    }),
    model: z
      .string({
        required_error: 'Model is required',
        invalid_type_error: 'Model must be string format',
      })
      .min(1, { message: 'Model is required' }),
    brand: z
      .string({
        required_error: 'Brand is required',
        invalid_type_error: 'Brand must be string format',
      })
      .min(1, { message: 'Brand is required' }),
    isDeleted: z.boolean().optional(), // Optional field, default to false
    image: z.string().optional(), // Optional field, default to false
    ratings: z.number()
  }),
});

const updateBikeValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          invalid_type_error: 'Name must be string format',
        })
        .min(1, { message: 'Name is required' })
        .optional(),
      description: z
        .string({
          invalid_type_error: 'Description must be string format',
        })
        .min(1, { message: 'Description is required' })
        .optional(),
      pricePerHour: z
        .number({
          invalid_type_error: 'Price per hour must be number format',
        })
        .positive({ message: 'Price per hour must be a positive number' })
        .optional(),
      isAvailable: z.boolean({ message: 'Availability status is required' }).optional(),
      cc: z
        .number({
          invalid_type_error: 'CC must be number format',
        })
        .positive({ message: 'CC must be a positive number' })
        .optional(),
      year: z
        .number({
          invalid_type_error: 'Year must be a number',
        })
        .optional(),
      model: z
        .string({
          invalid_type_error: 'Model must be string format',
        })
        .min(1, { message: 'Model is required' })
        .optional(),
      brand: z
        .string({
          invalid_type_error: 'Brand must be string format',
        })
        .min(1, { message: 'Brand is required' })
        .optional(),
      isDeleted: z.boolean().optional(),
      image: z.string().optional(),
      ratings: z.number().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});


export const bikeValidationSchemas = {
  createBikeValidationSchema,
  updateBikeValidationSchema,
};
