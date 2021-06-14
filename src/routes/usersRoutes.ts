import express from 'express';
import { ensureAuthorized } from '../middleware/auth';

import {
  identityCreation,
  loginWithPassword,
  loginWithPin,
} from '../controllers/userControllers';

const router = express.Router();

router.route('/identity').post(identityCreation);

router.route('/login_with_pin').post(loginWithPin);

router.route('/login_with_password').post(loginWithPassword);

export default router;
