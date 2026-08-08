# Quora-like API

A Q&A backend API inspired by Quora, built with Express and PostgreSQL.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

---

## Table of Contents

- [Project Description](#project-description)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation & Run](#installation--run)
- [How to Use the API (Postman)](#how-to-use-the-api-postman)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Database](#database)
- [Credits](#credits)
- [License](#license)
- [Thai Version](#เวอร์ชันภาษาไทย)

---

## Project Description

This project is a backend API that allows users to:

- Create / read / update / delete questions
- Search questions by title or category
- Post answers under a question (max 300 characters)
- View and delete answers for a question
- Vote Agree (+1) / Disagree (-1) on questions and answers
- Browse interactive API docs with Swagger UI

### Why these technologies?

| Technology         | Short reason                                                          |
| ------------------ | --------------------------------------------------------------------- |
| **Express**        | Beginner-friendly Node.js framework for REST APIs                     |
| **PostgreSQL**     | Relational database for questions/answers with Foreign Keys + CASCADE |
| **Express Router** | Groups related endpoints so `app.mjs` stays clean                     |
| **pg (Pool)**      | Connects Node.js to PostgreSQL and reuses connections                 |

### Current features

- Questions CRUD + Search
- Answers: create / list / delete all answers for a question
- Votes for questions and answers (`question_votes`, `answer_votes`)
- Centralized error handling middleware
- Swagger UI at `/api-docs`
- Deleting a question also deletes related answers (`ON DELETE CASCADE`)

### Future plans (not implemented yet)

- Authentication (login / register)
- Move validation into middleware between the path and the handler

---

## Folder Structure

```
backend-skill-checkpoint-express-server/
├── app.mjs                      # Server entry point: routers + middleware + Swagger
├── package.json                 # Dependencies and npm scripts
├── schema.sql                   # DB tables + ON DELETE CASCADE foreign keys
├── apply-schema.mjs             # Applies schema.sql to PostgreSQL
├── swagger.json                 # OpenAPI spec for Swagger UI
├── routes/
│   ├── questionRouter.mjs       # Questions, answers under questions, question votes
│   └── answerRouter.mjs         # Answer votes
├── middlewares/
│   └── errorHandler.mjs         # HttpError, notFoundHandler, errorHandler
└── utils/
    └── db.mjs                   # PostgreSQL connection pool
```

---

## Prerequisites

1. [Node.js](https://nodejs.org/) (v18+ recommended)
2. [PostgreSQL](https://www.postgresql.org/) with a database named `quora_mock`
3. [Postman](https://www.postman.com/) for API testing
4. Run `npm run db:schema` once so tables / `ON DELETE CASCADE` FKs are applied (`questions`, `answers`, `question_votes`, `answer_votes`)

---

## Installation & Run

### 1) Install packages

```bash
npm install
```

### 2) Configure the database connection

Open `utils/db.mjs` and make sure the `connectionString` matches your machine:

```text
postgresql://USERNAME:PASSWORD@localhost:5432/quora_mock
```

Example used in this project:

```js
connectionString: "postgresql://postgres:141559@localhost:5432/quora_mock";
```

### 3) Apply the database schema

```bash
npm run db:schema
```

This creates the tables (if needed) and ensures foreign keys use `ON DELETE CASCADE`.

### 4) Start the server

```bash
npm start
```

If it works, you should see something like:

```text
Server is running at 4000
```

Quick health check:

```text
GET http://localhost:4000/test
```

---

## How to Use the API (Postman)

Base URL: `http://localhost:4000`

In Postman, when sending a body: Body → **raw** → **JSON**

### Questions

| Method   | URL                                            | Body         |
| -------- | ---------------------------------------------- | ------------ |
| `POST`   | `/questions`                                   | see below    |
| `GET`    | `/questions`                                   | none         |
| `GET`    | `/questions/:questionId`                       | none         |
| `PUT`    | `/questions/:questionId`                       | same as POST |
| `DELETE` | `/questions/:questionId`                       | none         |
| `GET`    | `/questions/search?title=thai&category=Travel` | none         |

**Body for create/update question**

```json
{
  "title": "Is Thailand a good place to travel?",
  "description": "Which province should I visit first?",
  "category": "Travel"
}
```

### Answers

| Method   | URL                              | Body                                         |
| -------- | -------------------------------- | -------------------------------------------- |
| `POST`   | `/questions/:questionId/answers` | see below                                    |
| `GET`    | `/questions/:questionId/answers` | none                                         |
| `DELETE` | `/questions/:questionId/answers` | none (deletes all answers for that question) |

**Body for create answer** (max 300 characters)

```json
{
  "content": "Absolutely — especially Chiang Mai and Phuket."
}
```

### Votes

| Method | URL | Body |
|--------|-----|------|
| `POST` | `/questions/:questionId/vote` | `{ "vote": 1 }` or `{ "vote": -1 }` |
| `POST` | `/answers/:answerId/vote` | `{ "vote": 1 }` or `{ "vote": -1 }` |

- `1` = Agree  
- `-1` = Disagree  

### Recommended testing order for beginners

1. `POST /questions` → create a question
2. `GET /questions` → note the returned `id`
3. Replace `:questionId` in URLs with that `id`
4. Test GET by id → PUT → search
5. `POST` answer → `GET` answers
6. Vote question / vote answer
7. `DELETE` answers → `DELETE` question (related answers are removed via CASCADE if any remain)

---

## API Documentation (Swagger)

After starting the server, open:

```text
http://localhost:4000/api-docs
```

This page is powered by [`swagger-ui-express`](https://github.com/scottie1984/swagger-ui-express) and the `swagger.json` file.  
You can try endpoints directly in the browser (similar to Postman).

---

## Database

Schema is defined in `schema.sql` (apply with `npm run db:schema`).

Main tables used by the current API:

| Table | Purpose |
|-------|---------|
| `questions` | Stores questions (title, description, category) |
| `answers` | Stores answers linked by `question_id` |
| `question_votes` | Stores votes for questions (`vote`: 1 or -1) |
| `answer_votes` | Stores votes for answers (`vote`: 1 or -1) |

Key relationships:

- One question can have many answers
- One question / answer can have many votes
- Deleting a question also deletes its answers and question votes (`ON DELETE CASCADE`)
- Deleting an answer also deletes its answer votes (`ON DELETE CASCADE`)

---

## Credits

- Built as part of a Backend Skill Checkpoint
- Main stack: [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [node-postgres (pg)](https://node-postgres.com/), [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- References: Express Routing, PostgreSQL Foreign Keys / CASCADE, OpenAPI / Swagger

---

## License

This project uses the **ISC** license as defined in `package.json`.  
You may study and build on it according to that license.

---

---

# เวอร์ชันภาษาไทย

# Quora-like API

API สำหรับเว็บตั้งคำถาม–หาคำตอบ คล้าย Quora สร้างด้วย Express และ PostgreSQL

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

---

## สารบัญ

- [คำอธิบายโปรเจกต์](#คำอธิบายโปรเจกต์)
- [โครงสร้างโฟลเดอร์](#โครงสร้างโฟลเดอร์)
- [สิ่งที่ต้องมีก่อนเริ่ม](#สิ่งที่ต้องมีก่อนเริ่ม)
- [วิธีติดตั้งและรัน](#วิธีติดตั้งและรัน)
- [วิธีใช้งาน API (Postman)](#วิธีใช้งาน-api-postman)
- [เอกสาร API (Swagger)](#เอกสาร-api-swagger)
- [ฐานข้อมูล](#ฐานข้อมูล)
- [เครดิต](#เครดิต)
- [สิทธิ์การใช้งาน](#สิทธิ์การใช้งาน)

---

## คำอธิบายโปรเจกต์

โปรเจกต์นี้เป็น Backend API ที่ให้ผู้ใช้:

- สร้าง / ดู / แก้ไข / ลบคำถาม
- ค้นหาคำถามจากชื่อเรื่องหรือหมวดหมู่
- โพสต์คำตอบใต้คำถาม (ยาวไม่เกิน 300 ตัวอักษร)
- ดูและลบคำตอบของคำถามนั้น
- โหวต Agree (+1) / Disagree (-1) ให้คำถามและคำตอบ
- ดูเอกสาร API แบบ interactive ด้วย Swagger UI

### ทำไมเลือกเทคโนโลยีเหล่านี้

| เทคโนโลยี          | เหตุผลสั้น ๆ                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| **Express**        | เฟรมเวิร์ก Node.js ที่เรียนรู้ง่าย เหมาะทำ REST API                      |
| **PostgreSQL**     | ฐานข้อมูลแบบ relational เก็บคำถาม–คำตอบ และใช้ Foreign Key + CASCADE ได้ |
| **Express Router** | จัดกลุ่ม API ให้เป็นระเบียบ ไม่ยัดทุกอย่างในไฟล์เดียว                    |
| **pg (Pool)**      | เชื่อมต่อ PostgreSQL จาก Node.js และใช้ connection ร่วมกันได้            |

### สิ่งที่ทำได้ตอนนี้

- Questions CRUD + Search
- Answers สร้าง / ดู / ลบทั้งหมดของคำถามหนึ่งข้อ
- โหวตคำถามและคำตอบ (`question_votes`, `answer_votes`)
- Error handling ผ่าน middleware กลาง
- Swagger UI ที่ `/api-docs`
- เมื่อลบคำถาม คำตอบที่ผูกไว้จะถูกลบตาม (ON DELETE CASCADE)

### แผนในอนาคต (ยังไม่ได้ทำ)

- Authentication (login / สมัครสมาชิก)
- แยก validation เป็น middleware คั่นกลางระหว่าง path กับ handler

---

## โครงสร้างโฟลเดอร์

```
backend-skill-checkpoint-express-server/
├── app.mjs                      # จุดเริ่มต้นเซิร์ฟเวอร์ + router + Swagger
├── package.json                 # รายการ dependencies และสคริปต์รันโปรเจกต์
├── schema.sql                   # ตาราง DB + Foreign Key ON DELETE CASCADE
├── apply-schema.mjs             # สคริปต์รัน schema.sql ลง PostgreSQL
├── swagger.json                 # สเปก OpenAPI สำหรับ Swagger UI
├── routes/
│   ├── questionRouter.mjs       # คำถาม, คำตอบใต้คำถาม, โหวตคำถาม
│   └── answerRouter.mjs         # โหวตคำตอบ
├── middlewares/
│   └── errorHandler.mjs         # HttpError, notFoundHandler, errorHandler
└── utils/
    └── db.mjs                   # เชื่อมต่อ PostgreSQL (Connection Pool)
```

---

## สิ่งที่ต้องมีก่อนเริ่ม

1. [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน 18 ขึ้นไป)
2. [PostgreSQL](https://www.postgresql.org/) พร้อม database ชื่อ `quora_mock`
3. [Postman](https://www.postman.com/) สำหรับทดสอบ API
4. รัน `npm run db:schema` หนึ่งครั้งเพื่อสร้างตาราง / ตั้ง `ON DELETE CASCADE` (`questions`, `answers`, `question_votes`, `answer_votes`)

---

## วิธีติดตั้งและรัน

### 1) ติดตั้ง packages

```bash
npm install
```

### 2) ตั้งค่าการเชื่อมต่อฐานข้อมูล

เปิดไฟล์ `utils/db.mjs` แล้วตรวจว่า `connectionString` ตรงกับเครื่องคุณ:

```text
postgresql://USERNAME:PASSWORD@localhost:5432/quora_mock
```

ตัวอย่างในโปรเจกต์นี้:

```js
connectionString: "postgresql://postgres:141559@localhost:5432/quora_mock";
```

### 3) รัน schema ของฐานข้อมูล

```bash
npm run db:schema
```

คำสั่งนี้จะสร้างตาราง (ถ้ายังไม่มี) และตั้ง Foreign Key เป็น `ON DELETE CASCADE`

### 4) รันเซิร์ฟเวอร์

```bash
npm start
```

ถ้าสำเร็จ จะเห็นข้อความประมาณ:

```text
Server is running at 4000
```

ทดสอบเร็ว ๆ ได้ที่:

```text
GET http://localhost:4000/test
```

---

## วิธีใช้งาน API (Postman)

Base URL: `http://localhost:4000`

ใน Postman เลือก Body → **raw** → **JSON** เมื่อต้องส่ง body

### Questions

| Method   | URL                                           | Body        |
| -------- | --------------------------------------------- | ----------- |
| `POST`   | `/questions`                                  | ดูด้านล่าง  |
| `GET`    | `/questions`                                  | ไม่มี       |
| `GET`    | `/questions/:questionId`                      | ไม่มี       |
| `PUT`    | `/questions/:questionId`                      | เหมือน POST |
| `DELETE` | `/questions/:questionId`                      | ไม่มี       |
| `GET`    | `/questions/search?title=ไทย&category=Travel` | ไม่มี       |

**Body สำหรับสร้าง/แก้ไขคำถาม**

```json
{
  "title": "ประเทศไทยน่าไปเที่ยวไหม?",
  "description": "อยากรู้ว่าควรไปจังหวัดไหนเป็นที่แรก",
  "category": "Travel"
}
```

### Answers

| Method   | URL                              | Body                               |
| -------- | -------------------------------- | ---------------------------------- |
| `POST`   | `/questions/:questionId/answers` | ดูด้านล่าง                         |
| `GET`    | `/questions/:questionId/answers` | ไม่มี                              |
| `DELETE` | `/questions/:questionId/answers` | ไม่มี (ลบคำตอบทั้งหมดของคำถามนั้น) |

**Body สำหรับสร้างคำตอบ** (ไม่เกิน 300 ตัวอักษร)

```json
{
  "content": "น่าไปมาก โดยเฉพาะเชียงใหม่และภูเก็ต"
}
```

### Votes (โหวต)

| Method | URL | Body |
|--------|-----|------|
| `POST` | `/questions/:questionId/vote` | `{ "vote": 1 }` หรือ `{ "vote": -1 }` |
| `POST` | `/answers/:answerId/vote` | `{ "vote": 1 }` หรือ `{ "vote": -1 }` |

- `1` = เห็นด้วย (Agree)  
- `-1` = ไม่เห็นด้วย (Disagree)  

### ลำดับทดสอบที่แนะนำสำหรับมือใหม่

1. `POST /questions` → สร้างคำถาม
2. `GET /questions` → ดู `id` ที่ได้
3. เอา `id` ไปใส่ใน URL แทน `:questionId`
4. เทส GET ตาม id → PUT → search
5. `POST` คำตอบ → `GET` คำตอบ
6. โหวตคำถาม / โหวตคำตอบ
7. `DELETE` คำตอบ → `DELETE` คำถาม (คำตอบจะถูกลบตามด้วยถ้ายังเหลือ)

---

## เอกสาร API (Swagger)

หลังรันเซิร์ฟเวอร์แล้ว เปิดเบราว์เซอร์ไปที่:

```text
http://localhost:4000/api-docs
```

หน้านี้ใช้แพ็กเกจ [`swagger-ui-express`](https://github.com/scottie1984/swagger-ui-express) ร่วมกับไฟล์ `swagger.json`  
ลองเรียก API ได้เลยจากหน้าเว็บ (คล้าย Postman)

---

## ฐานข้อมูล

กำหนด schema ไว้ใน `schema.sql` (รันด้วย `npm run db:schema`)

ตารางหลักที่ใช้ใน API ตอนนี้:

| ตาราง | หน้าที่ |
|-------|---------|
| `questions` | เก็บคำถาม (title, description, category) |
| `answers` | เก็บคำตอบ ผูกกับ `question_id` |
| `question_votes` | เก็บโหวตของคำถาม (`vote`: 1 หรือ -1) |
| `answer_votes` | เก็บโหวตของคำตอบ (`vote`: 1 หรือ -1) |

ความสัมพันธ์สำคัญ:

- คำถาม 1 ข้อ มีคำตอบได้หลายข้อ
- คำถาม / คำตอบ 1 ข้อ มีโหวตได้หลายครั้ง
- ลบคำถามแล้ว คำตอบและโหวตคำถามถูกลบตาม (`ON DELETE CASCADE`)
- ลบคำตอบแล้ว โหวตคำตอบถูกลบตาม (`ON DELETE CASCADE`)

---

## เครดิต

- พัฒนาเป็นส่วนหนึ่งของ Backend Skill Checkpoint
- เทคโนโลยีหลัก: [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [node-postgres (pg)](https://node-postgres.com/), [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- เอกสารอ้างอิง: Express Routing, PostgreSQL Foreign Keys / CASCADE, OpenAPI / Swagger

---

## สิทธิ์การใช้งาน

โปรเจกต์นี้ใช้สิทธิ์แบบ **ISC** ตามที่ระบุใน `package.json`  
ใช้ศึกษาและพัฒนาต่อได้ตามเงื่อนไขของลิขสิทธิ์นั้น
