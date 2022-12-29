import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import { getRandomString } from './../utils/utilities'
import { sha256 } from 'js-sha256'
import { prisma } from '@/stores'
import createError from 'http-errors'
import moment from 'moment'

const getHashedPasswordWithPepper = (saltedPassword: string) => {
	return sha256(saltedPassword + process.env.PEPPER)
}

const validateRegistrationRequest = async (username: string) => {
	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
	})
	if (user != null) {
		throw createError(httpStatus.BAD_REQUEST, 'username existed')
	}
}

const register = async (
	username: string,
	password: string,
	fullName: string
) => {
	await validateRegistrationRequest(username)

	const salt = getRandomString(50)
	const hashedPasswordWithPepper = getHashedPasswordWithPepper(
		sha256(salt + password)
	)
	return await prisma.user.create({
		data: {
			username: username,
			salt: salt,
			password: hashedPasswordWithPepper,
			fullName: fullName,
		},
	})
}

const createToken = (username: string) => {
	const accessExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes')
	const access = jwt.sign(
		{ user: username, exp: accessExpires.unix(), iat: moment().unix() },
		process.env.JWT_SECRET
	)
	const refreshExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days')
	const refresh = jwt.sign(
		{ user: username, exp: refreshExpires.unix(), iat: moment().unix(), access: access },
		process.env.JWT_SECRET
	)
	return {access, refresh}
}

const validatePassword = async (username: string, password: string) => {
	const user = await prisma.user.findFirst({
		where: {
			username: username
		}
	})
	if (!user) {
		throw createError(httpStatus.UNAUTHORIZED, 'user not found')
	}
	const hashedPassword = sha256(process.env.PEPPER + sha256(user.salt + password))
	if (hashedPassword != user.password) {
		throw createError(httpStatus.UNAUTHORIZED, 'invalid username or password')
	}
}

const login = async (username: string, password: string) => {
	await validatePassword(username, password)

	const token = await createToken(username)
	return token
}

const refresh = async (refreshToken: string) => {
	try {
		const payload = jwt.verify(refreshToken, process.env.JWT_SECRET)
		const userData = await prisma.user.findFirst({where: {username: payload.user}})
		if (!userData) {
			throw createError(httpStatus.UNAUTHORIZED, 'user not found')
		}
		return createToken(userData.username)
	} catch (err) {
		throw createError(httpStatus.UNAUTHORIZED, 'invalid token')
	}
}

export { register, login, refresh }
