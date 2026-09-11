import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'jwt_secret_fallback_key_2026';
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET environment variable is missing. Using fallback key.');
  }

  const token = jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });

  if (res && typeof res.cookie === 'function') {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction, // HTTPS required when sameSite is 'none'
      sameSite: isProduction ? 'none' : 'lax', // 'none' allows cross-origin cookies between Vercel and backend
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  return token;
};

export default generateToken;
