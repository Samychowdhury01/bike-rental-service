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
// get all users from DB
router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUsers);
router.get(
  '/dashboard',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getDashboardData,
);

router.put(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.updateProfile,
);
router.put('/promote/:id', auth(USER_ROLE.admin), UserControllers.promoteUser);
router.delete('/:id', auth(USER_ROLE.admin), UserControllers.removeUser);

export const UserRoutes = router;
