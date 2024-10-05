import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middlewares/validateRequest';
import { bikeValidationSchemas } from './bike.validation';
import { BikeControllers } from './bike.controller';

const router = Router();

// only admin can access this route
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(bikeValidationSchemas.createBikeValidationSchema),
  BikeControllers.addBike,
);

// get all bikes user and admin both can see this route
router.get('/', BikeControllers.getAllBikes);
// get all bikes user and admin both can see this route
router.get('/:id', BikeControllers.getSingleBike);

// update bike data
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(bikeValidationSchemas.updateBikeValidationSchema),
  BikeControllers.updateBike,
);

// delete bike details 
router.delete('/:id', auth(USER_ROLE.admin), BikeControllers.deleteBike);
export const BikeRoutes = router;
