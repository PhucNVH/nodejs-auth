import httpStatus from 'http-status'
import { createError } from 'http-errors'
import {prisma} from '@/stores'

const getUserData = async (username: string) => {
	const user = await prisma.user.findFirst({where: {username: username}})
	if (!user) {
		throw createError(httpStatus.UNAUTHORIZED, 'user not found')
	}
	return user
}

export { getUserData }