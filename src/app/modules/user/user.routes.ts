import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { UserControllers } from './user.controller';

const router = Router();

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getProfile,
);
router.put(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.updateProfile,
);

export const UserRoutes = router;
