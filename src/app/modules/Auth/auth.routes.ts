import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidationSchema } from './auth.validation';

const router = Router();

// signup user route
router.post(
  '/signup',
  validateRequest(AuthValidationSchema.signupValidationSchema),
  AuthControllers.createUser,
);

// Login user route
router.post(
  '/login',
  validateRequest(AuthValidationSchema.loginSchema),
  AuthControllers.loginUser,
);

export const AuthRoutes = router;
