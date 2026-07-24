import express from "express";
import questionRouter from "./routes/questionRouter.mjs";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

// Group API ของคำถามไว้ที่ /questions
app.use("/questions", questionRouter);

// ดัก path ที่ไม่มี → ส่งต่อไป errorHandler
// Global/Application-level Middleware
app.use(notFoundHandler);

// ดัก error ทั้งหมดจากทุก API (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
