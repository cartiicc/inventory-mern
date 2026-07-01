import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT containing the user's id and role.
 * Role is embedded so middleware can authorize without an extra DB hit.
 */
export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Sends the JWT as an httpOnly cookie (secure storage — not localStorage)
 * AND in the JSON body, so SPA clients can also keep it in memory/Redux
 * for the Authorization header on cross-site deployments (Vercel/Render).
 */
export const sendTokenResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: (Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7) * 24 * 60 * 60 * 1000,
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};
