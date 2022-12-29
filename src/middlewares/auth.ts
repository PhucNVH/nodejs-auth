import httpStatus from 'http-status';
import { ApiError } from '@/utils/ApiError';
import jwt from 'jsonwebtoken';

export const auth = () => (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError(httpStatus.BAD_REQUEST, err as string));
  }
  return next();
};
