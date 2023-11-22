// create web server
// create a route
// create a callback function
// send back a response

const express = require("express");
const commentsRouter = express.Router({ mergeParams: true });
const { check, validationResult } = require("express-validator");
const { Comment } = require("../db/models");
const { asyncHandler, csrfProtection } = require("./utils");
const { requireAuth } = require("../auth");

const commentValidators = [
  check("comment")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a comment"),
];

commentsRouter.post(
  "/",
  requireAuth,
  commentValidators,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { id } = req.params;
    const { userId } = req.session.auth;
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      const newComment = await Comment.create({
        userId,
        postId: id,
        comment,
      });
      res.redirect(`/posts/${id}`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("post-detail", {
        id,
        comment,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

commentsRouter.delete(
  "/:commentId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findByPk(commentId);
    await comment.destroy();
    res.redirect(`/posts/${comment.postId}`);
  })
);

module.exports = commentsRouter;