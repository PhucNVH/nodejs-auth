import catchAsync from '@/utils/catchAsync'
import { getUserData } from '@/services/user.service'

const getUser = catchAsync(async (req, res) => {
	const user = await getUserData(req.user)
	res.status(200).json({
		username: user.username,
		id: user.id,
		fullName: user.fullName
	})
})

export { getUser }