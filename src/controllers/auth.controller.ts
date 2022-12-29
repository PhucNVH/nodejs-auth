import { register, login, refresh } from '@/services/auth.service'
import catchAsync from '@/utils/catchAsync'

const loginHandler = catchAsync(async (req, res) => {
	const token = await login(req.body.username, req.body.password)
	res.status(201).json(token)
})

const registerHandler = catchAsync(async (req, res) => {
	const user = await register(req.body.username, req.body.password, req.body.fullName)
	res.status(201).json({
		id: user.id,
		username: user.username,
		fullName: user.fullName
	})
})

const refreshHandler = catchAsync(async (req, res) => {
	const token = await refresh(req.body.refresh)
	res.status(200).json(token)
})

export { loginHandler, registerHandler, refreshHandler }
