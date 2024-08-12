import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidationSchemas } from './booking.validation';
import { BookingControllers } from './booking.controller';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(bookingValidationSchemas.createBookingValidationSchema),
  BookingControllers.createBooking,
);

router.get(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  BookingControllers.getUserRentals,
);

router.put(
  '/:id/return',
  auth(USER_ROLE.admin),
  BookingControllers.returnedBike,
);
export const BookingRoutes = router;
