import faker from 'faker'
import httpStatus from 'http-status'
import { prisma } from '@/stores'
import app from '@/index'
import request from 'supertest'
import { insertUsers } from '@/tests/fixtures/user.fixture'

describe('POST /api/v1/auth/login', () => {
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

	test('should return 201 and successfully login user if username and password match', async () => {
		await insertUsers([newUser])
		const res = await request(app).post('/api/v1/auth/login').send({
			username: newUser.username,
			password: newUser.password
		}).expect(httpStatus.CREATED)
  
		expect(res.body).toEqual({
			access: expect.anything(),
			refresh: expect.anything(),
		})
	})

	test('should return 401 error if there are no users with that username', async () => {
		await request(app).post('/api/v1/auth/login').send({
			username: newUser.username,
			password: newUser.password
		}).expect(httpStatus.UNAUTHORIZED)
	})

	test('should return 401 error if password is wrong', async () => {
		await insertUsers([newUser])
  
		await request(app).post('/api/v1/auth/login').send({
			username: newUser.username,
			password: 'wrong_password'
		}).expect(httpStatus.UNAUTHORIZED)
	})
})