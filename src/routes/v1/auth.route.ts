import { loginHandler, refreshHandler, registerHandler } from '@/controllers/auth.controller'
import { validate } from '@/middlewares/validate'
import { login, refresh, register } from '@/validators/auth.validator'
import { Router } from 'express'

const router = Router()
router.post('/register', validate(register), registerHandler)
router.post('/login', validate(login), loginHandler)
router.post('/refresh', validate(refresh), refreshHandler)

export { router as authRouter }
