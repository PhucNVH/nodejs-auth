import { Router } from 'express'

import { authRouter } from '@/routes/authRoutes'

const router = Router()

router.use('/auth', authRouter)

export default router
