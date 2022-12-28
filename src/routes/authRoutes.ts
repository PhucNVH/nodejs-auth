import { loginHandler } from '@/controllers/auth'
import { Router } from 'express'

const router = Router()

router.post('/login', loginHandler)

export { router as authRouter }
