import faker from 'faker'
import httpStatus from 'http-status'
import { prisma } from '@/db'
import main from '@/main'
import request from 'supertest'
import { insertUsers } from '../fixtures/user.fixture'

describe('POST /api/auth/register', () => {
	let newUser
	beforeEach(() => {
		newUser = {
			username: faker.name.findName(),
			password: 'password1',
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
		const res = await request(main).post('/api/auth/register').send(newUser).expect(httpStatus.CREATED)
  
		expect(res.body).not.toHaveProperty('password')
		expect(res.body).toEqual({
			id: expect.anything(),
			username: newUser.username
		})
  
		const dbUser = await prisma.user.findUnique({
			where: {
				id: res.body.user.id
			}
		})
		expect(dbUser).toBeDefined()
		expect(dbUser?.username).toEqual(newUser.username)
	})

	test('should return 400 error if username is already used', async () => {
		await insertUsers([newUser])
  
		await request(main).post('/api/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST)
	})
})