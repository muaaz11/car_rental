import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import userRoute from './routes/user.routes.ts'
import CookieParser from 'cookie-parser'
dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json()) // very very important
app.use(CookieParser())

app.listen(port, () => {
    console.log("app is running", port)
})

app.use("/", userRoute)



