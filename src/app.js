import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./v1/routes/authRoutes.js";
import noticeRoutes from "./v1/routes/noticeRoutes.js";

const PORT = 3868;

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
// Disabled Cors for production
// app.use(cors({
//     origin: "*"
// }));

// setup Routes 

//localhost:3868/api/v1/auth
app.use('/v1/auth', authRoutes);

//localhost:3868/api/v1/notices
app.use('/v1/notices', noticeRoutes);

app.listen(PORT, () => {
    console.log(`This HTTP app is running on port: ${PORT}`);
});