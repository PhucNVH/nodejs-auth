import {prisma} from '@/db'
import { sha256 } from 'js-sha256'

const password = 'password1'
const salt = 'salt'
const hashedPassword = sha256(process.env.PEPPER + sha256(salt + password))

const insertUsers = async (users) => {
	await prisma.user.createMany({
		data: users.map((user) => ({ ...user, password: hashedPassword }))
	})
}

export {insertUsers}