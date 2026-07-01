import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { registerRules, validate } from '../validators/authValidator.js';

const router = express.Router();

router.use(protect, authorize('admin')); // entire resource is admin-only

router.route('/').get(getUsers).post(registerRules, validate, createUser);
router.route('/:id').put(updateUser).delete(deleteUser);

export default router;
