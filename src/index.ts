import express from 'express'
import cors from 'cors'
import routerV1 from '@/routes/v1/index'
import 'dotenv/config'

declare module 'express-serve-static-core' {
	interface Request {
		user: string;
	}
}

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1', routerV1)

if (process.env.NODE_ENV !== 'test') {
	app.listen(process.env.APP_PORT, function() {
		console.log( `Server listening on ${process.env.APP_HOST}:${process.env.APP_PORT}`)
	})
}


export default app