const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./src/middlewares/error");
const routes = require("./src/routes");
const authRoutes = require("./src/routes/authRoute");

const app = express();

// Middleware for security headers
app.use(helmet());

// Middleware for logging requests in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for handling cookies
app.use(cookieParser());

// Middleware to compress responses
app.use(compression());

// CORS setup
// app.use(
//   cors({
//     origin: "*", // Adjust allowed origins as needed
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", [
//     "http://localhost:3000",
//     "https://luxurafootwear.pages.dev/",
//   ]); // Replace with your frontend URL
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
// Mount routes
app.use("/api/users", authRoutes);
app.use("/api", routes);

// Global error handling middleware
app.use(errorMiddleware);

// Catch unhandled routes
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = "fail";
  next(err);
});

module.exports = app;
