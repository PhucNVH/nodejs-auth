import httpStatus from 'http-status'
import { ApiError } from '@/utils/ApiError'
import jwt from 'jsonwebtoken'

export const auth = () => (req, res, next) => {
	try {
		const payload = jwt.verify(req.headers.authorization?.split(' ')[1], process.env.JWT_SECRET)
		req.user = payload.user
		return next()
	} catch (err) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, err as string))
	}
}
