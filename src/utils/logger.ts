import pino from 'pino'

export const logger = pino({
	level: process.env.PINO_LOG_LEVEL || 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	enabled: !process.env.NOLOG ? true : false,
})
