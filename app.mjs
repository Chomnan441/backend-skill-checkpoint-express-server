import express from "express";
import { createRequire } from "module";
import swaggerUi from "swagger-ui-express";
import questionRouter from "./routes/questionRouter.mjs";
import answerRouter from "./routes/answerRouter.mjs";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.mjs";

const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger.json");

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

// API Documentation (Swagger UI)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Group API ของคำถามไว้ที่ /questions
app.use("/questions", questionRouter);

// Group API ของคำตอบไว้ที่ /answers (ใช้โหวตคำตอบ)
app.use("/answers", answerRouter);

// ดัก path ที่ไม่มี → ส่งต่อไป errorHandler
app.use(notFoundHandler);

// ดัก error ทั้งหมดจากทุก API (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api-docs`);
});
