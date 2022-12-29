import { loginHandler, registerHandler } from '@/controllers/auth.controller'
import { validate } from '@/middlewares/validate'
import { login, register } from '@/validators/auth.validator'
import { Router } from 'express'

const router = Router()
router.post('/register', validate(register), registerHandler)
router.post('/login', validate(login), loginHandler)

export { router as authRouter }
