import { getUser } from '@/controllers/user.controller'
import { auth } from '@/middlewares/auth'
import { Router } from 'express'

const router = Router()
router.get('/', auth(), getUser)

export { router as userRouter }
