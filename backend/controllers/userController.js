import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all users (staff accounts)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Create a new staff/admin account
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('A user with this email already exists');
  }

  const user = await User.create({ name, email, password, role: role || 'staff' });

  await logActivity({
    user: req.user,
    action: 'USER_CREATED',
    entityType: 'User',
    entityId: user._id,
    description: `${req.user.name} created a new ${user.role} account for ${user.name}`,
  });

  res.status(201).json({ success: true, user });
});

// @desc    Update a user's role / active status / details
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, role, isActive } = req.body;
  if (name) user.name = name;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  const updated = await user.save();

  await logActivity({
    user: req.user,
    action: 'USER_UPDATED',
    entityType: 'User',
    entityId: user._id,
    description: `${req.user.name} updated account for ${user.name}`,
  });

  res.status(200).json({ success: true, user: updated });
});

// @desc    Delete a staff account
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.equals(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  await user.deleteOne();

  await logActivity({
    user: req.user,
    action: 'USER_DELETED',
    entityType: 'User',
    entityId: user._id,
    description: `${req.user.name} deleted account for ${user.name}`,
  });

  res.status(200).json({ success: true, message: 'User deleted successfully' });
});
