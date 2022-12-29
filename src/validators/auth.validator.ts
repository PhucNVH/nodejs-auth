import { password } from './custom.validator'

import Joi from 'joi'

const register = {
	body: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().required().custom(password),
		fullName: Joi.string().required(),
	}),
}

const login = {
	body: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
}

export { register, login }
