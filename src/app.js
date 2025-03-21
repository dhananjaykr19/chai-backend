import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
// whenever u have to use middleware or to set config that time we use app.use(cors())
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "10kb"}))
app.use(express.urlencoded({extended : true, limit : "10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from "./routs/user.routes.js";

// routes declaration

app.use("/api/v1/users", userRouter)

// http://localhost/api/v1/users
export { app }