import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";
import messageRoute from './src/routes/message.route.js'
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoute);

app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
    connectDB();
});
