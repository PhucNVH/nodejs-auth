import faker from 'faker'
import httpStatus from 'http-status'
import { prisma } from '@/stores'
import app from '@/index'
import request from 'supertest'
import { createToken, insertUsers } from '@/tests/fixtures/user.fixture'
import moment from 'moment'

describe('POST /api/v1/auth/refresh', () => {
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

	test('should return 200 and new auth tokens if refresh token is valid', async () => {
		await insertUsers([newUser])
		const loginRes = await request(app).post('/api/v1/auth/login').send({
			username: newUser.username,
			password: newUser.password
		}).expect(httpStatus.CREATED)

		const res = await request(app).post('/api/v1/auth/refresh').send({
			'refresh': loginRes.body.refresh
		}).expect(httpStatus.OK)
  
		expect(res.body).toEqual({
			access: expect.anything(),
			refresh: expect.anything(),
		})
	})

	test('should return 400 error if refresh token is missing from request body', async () => {
		await request(app).post('/api/v1/auth/refresh').send().expect(httpStatus.BAD_REQUEST)
	})

	test('should return 401 error if refresh token is signed using an invalid secret', async () => {
		await insertUsers([newUser])
		const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days')
		const refresh = createToken(newUser.username, expires, 'invalidSecret')
  
		await request(app).post('/api/v1/auth/refresh').send({ refresh }).expect(httpStatus.UNAUTHORIZED)
	})

	test('should return 401 if token is expired', async () => {
		await insertUsers([newUser])

		const expires = moment().subtract(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days')
		const refresh = createToken(newUser.username, expires)
		await request(app).post('/api/v1/auth/refresh').send({ refresh }).expect(httpStatus.UNAUTHORIZED)
	})
})