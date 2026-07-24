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
- Centralized error handling middleware
- Deleting a question also deletes related answers (`ON DELETE CASCADE`)

### Future plans (not implemented yet)

- Voting for questions/answers (`question_votes`, `answer_votes`)
- Authentication (login / register)
- Move validation into middleware between the path and the handler

---

## Folder Structure

```
backend-skill-checkpoint-express-server/
├── app.mjs                      # Server entry point: routers + middleware
├── package.json                 # Dependencies and npm scripts
├── routes/
│   └── questionRouter.mjs       # Questions and answers APIs
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
4. Database tables from the ERD: `questions`, `answers`, `question_votes`, `answer_votes`

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

### 3) Start the server

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

### Recommended testing order for beginners

1. `POST /questions` → create a question
2. `GET /questions` → note the returned `id`
3. Replace `:questionId` in URLs with that `id`
4. Test GET by id → PUT → search
5. `POST` answer → `GET` answers → `DELETE` answers
6. `DELETE` question (related answers are removed via CASCADE if any remain)

---

## Database

Main tables used by the current API:

| Table       | Purpose                                         |
| ----------- | ----------------------------------------------- |
| `questions` | Stores questions (title, description, category) |
| `answers`   | Stores answers linked by `question_id`          |

Key relationships:

- One question can have many answers
- Deleting a question also deletes its answers (`ON DELETE CASCADE`)

`question_votes` and `answer_votes` exist in the ERD but have no API endpoints in this version.

---

## Credits

- Built as part of a Backend Skill Checkpoint
- Main stack: [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [node-postgres (pg)](https://node-postgres.com/)
- References: Express Routing, PostgreSQL Foreign Keys / CASCADE

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
- Error handling ผ่าน middleware กลาง
- เมื่อลบคำถาม คำตอบที่ผูกไว้จะถูกลบตาม (ON DELETE CASCADE)

### แผนในอนาคต (ยังไม่ได้ทำ)

- ระบบโหวตคำถาม/คำตอบ (`question_votes`, `answer_votes`)
- Authentication (login / สมัครสมาชิก)
- แยก validation เป็น middleware คั่นกลางระหว่าง path กับ handler

---

## โครงสร้างโฟลเดอร์

```
backend-skill-checkpoint-express-server/
├── app.mjs                      # จุดเริ่มต้นเซิร์ฟเวอร์ ต่อ router + middleware
├── package.json                 # รายการ dependencies และสคริปต์รันโปรเจกต์
├── routes/
│   └── questionRouter.mjs       # API ของ questions และ answers
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
4. ตารางใน database ตาม ERD: `questions`, `answers`, `question_votes`, `answer_votes`

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

### 3) รันเซิร์ฟเวอร์

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

### ลำดับทดสอบที่แนะนำสำหรับมือใหม่

1. `POST /questions` → สร้างคำถาม
2. `GET /questions` → ดู `id` ที่ได้
3. เอา `id` ไปใส่ใน URL แทน `:questionId`
4. เทส GET ตาม id → PUT → search
5. `POST` คำตอบ → `GET` คำตอบ → `DELETE` คำตอบ
6. `DELETE` คำถาม (คำตอบจะถูกลบตามด้วยถ้ายังเหลือ)

---

## ฐานข้อมูล

ตารางหลักที่ใช้ใน API ตอนนี้:

| ตาราง       | หน้าที่                                  |
| ----------- | ---------------------------------------- |
| `questions` | เก็บคำถาม (title, description, category) |
| `answers`   | เก็บคำตอบ ผูกกับ `question_id`           |

ความสัมพันธ์สำคัญ:

- คำถาม 1 ข้อ มีคำตอบได้หลายข้อ
- ลบคำถามแล้ว คำตอบที่ผูกไว้ถูกลบตาม (`ON DELETE CASCADE`)

ตาราง `question_votes` และ `answer_votes` มีใน ERD แล้ว แต่ยังไม่มี API ในรอบนี้

---

## เครดิต

- พัฒนาเป็นส่วนหนึ่งของ Backend Skill Checkpoint
- เทคโนโลยีหลัก: [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [node-postgres (pg)](https://node-postgres.com/)
- เอกสารอ้างอิง: Express Routing, PostgreSQL Foreign Keys / CASCADE

---

## สิทธิ์การใช้งาน

โปรเจกต์นี้ใช้สิทธิ์แบบ **ISC** ตามที่ระบุใน `package.json`  
ใช้ศึกษาและพัฒนาต่อได้ตามเงื่อนไขของลิขสิทธิ์นั้น
