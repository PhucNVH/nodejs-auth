import { Router } from 'express'

import { authRouter } from '@/routes/v1/auth.route'
import { userRouter } from './user.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', userRouter)

export default router
