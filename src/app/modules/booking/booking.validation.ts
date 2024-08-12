import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    bikeId: z.string({
      required_error: 'Bike ID is required',
      invalid_type_error: 'Bike ID must be String type!',
    }),
    startTime: z
      .string({
        required_error: 'Start Time is required',
        invalid_type_error: 'Start Time must be String type!',
      })
      .datetime(),
  }),
});

export const bookingValidationSchemas = {
  createBookingValidationSchema,
};
