import jwt from 'jsonwebtoken'
import { prisma } from '@/stores'
import { sha256 } from 'js-sha256'
import moment, { Moment } from 'moment'

const password = 'password1'
const salt = 'salt'
const hashedPassword = sha256(process.env.PEPPER + sha256(salt + password))

const insertUsers = async (users) => {
	await prisma.user.createMany({
		data: users.map((user) => ({ ...user, password: hashedPassword }))
	})
}

const createToken = (username: string, exprires: Moment, secret = process.env.JWT_PRIVATEKEY) => {
	return jwt.sign(
		{ user: username, exp: exprires.unix(), iat: moment().unix() },
		secret
	)
}

export {insertUsers, createToken}