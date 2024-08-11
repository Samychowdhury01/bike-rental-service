import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SignupValidationSchemas } from './auth.validation';

const router = Router();

// signup user route
router.post(
  '/signup',
  validateRequest(SignupValidationSchemas.signupValidationSchema),
  AuthControllers.createUser,
);

export const AuthRoutes = router;
