import faker from 'faker'
import httpStatus from 'http-status'
import { prisma } from '@/stores'
import app from '@/index'
import request from 'supertest'
import { insertUsers } from '@/tests/fixtures/user.fixture'

describe('POST /api/v1/auth/register', () => {
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

	test('should return 201 and successfully register user if request data is ok', async () => {
		const res = await request(app).post('/api/v1/auth/register').send(newUser).expect(httpStatus.CREATED)
  
		expect(res.body).not.toHaveProperty('password')
		expect(res.body).toEqual({
			id: expect.anything(),
			username: newUser.username,
			fullName: newUser.fullName
		})
  
		const dbUser = await prisma.user.findUnique({
			where: {
				id: res.body.id
			}
		})
		expect(dbUser).toBeDefined()
		expect(dbUser?.username).toEqual(newUser.username)
	})

	test('should return 400 error if username is already used', async () => {
		await insertUsers([newUser])
  
		await request(app).post('/api/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST)
	})
})