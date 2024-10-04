const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
require("./src/config/dbConnection");

const globalErrorHandler = require("./src/controllers/errorController");
const AppError = require("./src/utils/AppError");

const userRouter = require("./src/routes/userRouter");
const jobRouter = require("./src/routes/jobRouter");
const courseRouter = require("./src/routes/courseRouter");
const lessonRouter = require("./src/routes/lessonRouter");
const certificatRouter = require('./src/routes/certificatRouter');
const examRoutes = require("./src/routes/examRouter");
const newsRoutes = require("./src/routes/newsRouter");


const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`node : ${process.env.NODE_ENV}`);
} else {
  console.log(`node: ${process.env.NODE_ENV}`);
}


app.use("/sef/api/v1/users", userRouter);
app.use("/sef/api/v1/jobs", jobRouter);
app.use("/sef/api/v1/course", courseRouter);
app.use("/sef/api/v1/course", lessonRouter);
app.use("/sef/api/v1/certificat", certificatRouter);
app.use("/sef/api/v1/exam", examRoutes);
app.use("/sef/api/v1/news", newsRoutes);



app.all("*", (req, res, next) => {
  return next(new AppError(`cant find this rout : ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`Shutting down ...`);
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`uncaughtException Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`Shutting down ...`);
    process.exit(1);
  });
});
