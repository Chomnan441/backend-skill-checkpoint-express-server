import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { HttpError } from "../middlewares/errorHandler.mjs";

const answerRouter = Router();

// POST /answers/:answerId/vote
// body: { "vote": 1 } = Agree, { "vote": -1 } = Disagree
answerRouter.post("/:answerId/vote", async (req, res, next) => {
  try {
    const answerId = req.params.answerId;
    const { vote } = req.body;

    if (vote !== 1 && vote !== -1) {
      throw new HttpError(400, "Invalid vote value.");
    }

    const answerResult = await connectionPool.query(
      `SELECT id FROM answers WHERE id = $1`,
      [answerId],
    );

    if (answerResult.rows.length === 0) {
      throw new HttpError(404, "Answer not found.");
    }

    await connectionPool.query(
      `INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)`,
      [answerId, vote],
    );

    return res.status(200).json({
      message: "Vote on the answer has been recorded successfully.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(500, "Unable to vote answer."));
  }
});

export default answerRouter;
