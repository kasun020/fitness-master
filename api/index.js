import express from "express";
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/signupRoute.js";
import registerRoute from "./Routes/registerRoute.js";
//import workoutRoute from "./Routes/workoutRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Database is connected");
  } catch (err) {
    console.error("MongoDB connection FAIL", err);
    process.exit(1); // Exit process with failure
  }
};

const storage = multer.memoryStorage(); // Use memory storage for buffers
// or
// const storage = multer.diskStorage({ ... }); // Use disk storage for file paths

const upload = multer({ storage: storage });

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/register", registerRoute);
//app.use('/workouts', workoutRoute);

app.get("/", (req, res) => {
  res.send("API is working");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
  }
};

startServer();

export { upload };
