import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { HttpError } from "../middlewares/errorHandler.mjs";

const questionRouter = Router();

// ---------- Questions ----------

// POST /questions
questionRouter.post("/", async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      throw new HttpError(400, "Invalid request data.");
    }

    await connectionPool.query(
      `INSERT INTO questions (title, description, category)
       VALUES ($1, $2, $3)`,
      [title, description, category],
    );

    return res.status(201).json({
      message: "Question created successfully.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to create question."));
  }
});

// GET /questions
questionRouter.get("/", async (req, res, next) => {
  try {
    const result = await connectionPool.query(
      `SELECT * FROM questions ORDER BY id ASC`,
    );

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    return next(new HttpError(500, "Unable to fetch questions."));
  }
});

// GET /questions/search?title=&category=
// ต้องวางก่อน /:questionId
questionRouter.get("/search", async (req, res, next) => {
  try {
    const title = req.query.title || "";
    const category = req.query.category || "";

    if (!title && !category) {
      throw new HttpError(400, "Invalid search parameters.");
    }

    const result = await connectionPool.query(
      `SELECT * FROM questions
       WHERE
         ($1 = '' OR title ILIKE '%' || $1 || '%')
         AND
         ($2 = '' OR category ILIKE '%' || $2 || '%')
       ORDER BY id ASC`,
      [title, category],
    );

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to fetch a question."));
  }
});

// GET /questions/:questionId
questionRouter.get("/:questionId", async (req, res, next) => {
  try {
    const questionId = req.params.questionId;

    const result = await connectionPool.query(
      `SELECT * FROM questions WHERE id = $1`,
      [questionId],
    );

    if (result.rows.length === 0) {
      throw new HttpError(404, "Question not found.");
    }

    return res.status(200).json({
      data: result.rows[0],
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to fetch questions."));
  }
});

// PUT /questions/:questionId
questionRouter.put("/:questionId", async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      throw new HttpError(400, "Invalid request data.");
    }

    const result = await connectionPool.query(
      `UPDATE questions
       SET title = $2, description = $3, category = $4
       WHERE id = $1`,
      [questionId, title, description, category],
    );

    if (result.rowCount === 0) {
      throw new HttpError(404, "Question not found.");
    }

    return res.status(200).json({
      message: "Question updated successfully.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to update question."));
  }
});

// DELETE /questions/:questionId
questionRouter.delete("/:questionId", async (req, res, next) => {
  try {
    const questionId = req.params.questionId;

    const result = await connectionPool.query(
      `DELETE FROM questions WHERE id = $1`,
      [questionId],
    );

    if (result.rowCount === 0) {
      throw new HttpError(404, "Question not found.");
    }

    return res.status(200).json({
      message: "Question post has been deleted successfully.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to delete question."));
  }
});

// ---------- Vote Question ----------

// POST /questions/:questionId/vote
// body: { "vote": 1 } = Agree, { "vote": -1 } = Disagree
questionRouter.post("/:questionId/vote", async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const { vote } = req.body;

    if (vote !== 1 && vote !== -1) {
      throw new HttpError(400, "Invalid vote value.");
    }

    const questionResult = await connectionPool.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionId],
    );

    if (questionResult.rows.length === 0) {
      throw new HttpError(404, "Question not found.");
    }

    await connectionPool.query(
      `INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)`,
      [questionId, vote],
    );

    return res.status(200).json({
      message: "Vote on the question has been recorded successfully.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to vote question."));
  }
});

// ---------- Answers ----------

// POST /questions/:questionId/answers
questionRouter.post("/:questionId/answers", async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const { content } = req.body;

    if (!content || content.length > 300) {
      throw new HttpError(400, "Invalid request data.");
    }

    const questionResult = await connectionPool.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionId],
    );

    if (questionResult.rows.length === 0) {
      throw new HttpError(404, "Question not found.");
    }

    await connectionPool.query(
      `INSERT INTO answers (question_id, content) VALUES ($1, $2)`,
      [questionId, content],
    );

    return res.status(201).json({
      message: "Answer created successfully.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to create answers."));
  }
});

// GET /questions/:questionId/answers
questionRouter.get("/:questionId/answers", async (req, res, next) => {
  try {
    const questionId = req.params.questionId;

    const questionResult = await connectionPool.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionId],
    );

    if (questionResult.rows.length === 0) {
      throw new HttpError(404, "Question not found.");
    }

    const result = await connectionPool.query(
      `SELECT id, content FROM answers WHERE question_id = $1 ORDER BY id ASC`,
      [questionId],
    );

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to fetch answers."));
  }
});

// DELETE /questions/:questionId/answers
questionRouter.delete("/:questionId/answers", async (req, res, next) => {
  try {
    const questionId = req.params.questionId;

    const questionResult = await connectionPool.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionId],
    );

    if (questionResult.rows.length === 0) {
      throw new HttpError(404, "Question not found.");
    }

    await connectionPool.query(`DELETE FROM answers WHERE question_id = $1`, [
      questionId,
    ]);

    return res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to delete answers."));
  }
});

export default questionRouter;
