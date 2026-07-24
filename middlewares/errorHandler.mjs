// Error ที่เราสร้างเอง — ใส่ statusCode + message ตาม API document
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ดัก path ที่ไม่มีในระบบ (วางหลัง routes ทั้งหมด)
export function notFoundHandler(req, res, next) {
  next(new HttpError(404, "Not found."));
}

// Middleware กลางสำหรับส่ง error กลับไปให้ client
// ต้องมี 4 parameters (err, req, res, next) Express ถึงจะรู้ว่าเป็น error middleware
//  next ไม่ได้ส่งไม้ต่อ
export function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({ message });
}
