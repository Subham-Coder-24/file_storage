import express from "express";
// import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

// Load environment variables from .env file
dotenv.config();
const PORT = process.env.PORT || 4000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});
// Middleware
app.use(cors());
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.json());

// Routes
import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRouter.js";

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);

// Function to process the raw data

app.get("/", async (req, res) => {
  return res.status(200).json("questions");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
