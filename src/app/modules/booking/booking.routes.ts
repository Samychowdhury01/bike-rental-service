import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidationSchemas } from './booking.validation';
import { BookingControllers } from './booking.controller';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(bookingValidationSchemas.createBookingValidationSchema),
  BookingControllers.createBooking,
);


router.get(
  '/',
  auth(USER_ROLE.user),
  BookingControllers.getUserRentals,
);
router.get(
  '/all',
  auth(USER_ROLE.admin),
  BookingControllers.getAllRentals,
);
// get all the canceled bookings 
router.get(
  '/canceled',
  auth(USER_ROLE.admin),
  BookingControllers.getAllCanceledRentals,
)

// get all user canceled bookings 
router.get(
  '/user/canceled',
  auth(USER_ROLE.user),
  BookingControllers.getUserCanceledRentals,
)
router.put(
  '/:id/return',
  auth(USER_ROLE.admin),
  BookingControllers.returnedBike,
);

router.put(
  '/:id/cancel',
  auth(USER_ROLE.user),
  BookingControllers.cancelBooking,
);
export const BookingRoutes = router;
