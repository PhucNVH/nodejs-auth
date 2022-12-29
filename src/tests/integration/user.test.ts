import faker from 'faker'
import httpStatus from 'http-status'
import { prisma } from '@/stores'
import app from '@/index'
import request from 'supertest'
import { createToken, insertUsers } from '@/tests/fixtures/user.fixture'
import moment from 'moment'

describe('POST /api/v1/auth/users', () => {
	let newUser
	beforeEach(() => {
		newUser = {
			username: 'user01',
			password: 'password1',
			fullName: faker.name.findName()
		}
	})

	afterEach(async () => {
		const deleteUsers = prisma.user.deleteMany()

		await prisma.$transaction([
			deleteUsers
		])
        
		await prisma.$disconnect()
	})

	test('should return 200 if token is valid', async () => {
		await insertUsers([newUser])

		const expires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes')
		const accessToken = createToken(newUser.username, expires)
		const res = await request(app).get('/api/v1/users').set({Authorization: 'Bearer ' + accessToken}).expect(httpStatus.OK)
  
		expect(res.body).toEqual({
			id: expect.anything(),
			username: newUser.username,
			fullName: newUser.fullName,
		})
	})

	test('should return 401 if token is created by invalid secret', async () => {
		await insertUsers([newUser])

		const expires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes')
		const accessToken = createToken(newUser.username, expires, 'invalidSecret')
		await request(app).get('/api/v1/users').set({Authorization: 'Bearer ' + accessToken}).expect(httpStatus.UNAUTHORIZED)
	})

	test('should return 401 if token is expired', async () => {
		await insertUsers([newUser])

		const expires = moment().subtract(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes')
		const accessToken = createToken(newUser.username, expires)
		await request(app).get('/api/v1/users').set({Authorization: 'Bearer ' + accessToken}).expect(httpStatus.UNAUTHORIZED)
	})

	test('should return 401 if user not found', async () => {
		const expires = moment().subtract(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes')
		const accessToken = createToken(newUser.username, expires)
		await request(app).get('/api/v1/users').set({Authorization: 'Bearer ' + accessToken}).expect(httpStatus.UNAUTHORIZED)
	})
})