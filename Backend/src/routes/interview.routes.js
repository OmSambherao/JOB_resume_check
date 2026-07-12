const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const interviewRoute = express.Router();

const {
  generateInterviewReportController,
  getInterviewReportController,
  getAllInterviewReportController,
} = require("../controllers/interview.controller");

const upload = require("../middleware/file.middlewear");

/**
 * @route POST api/interview
 * @description get a interview report on the basis of user self description , resume , pdf ans job desciption
 * @access private
 */

interviewRoute.post(
  "/",
  authMiddleware.verifyToken,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @route POST api/interview/report/:interviewId
 * @description get a interview report by interview ID
 */

interviewRoute.get(
  "/report/:interviewId",
  authMiddleware.verifyToken,
  getInterviewReportController,
);

/**
 *
 * @description get all interview report by the user logged in
 */

interviewRoute.get(
  "/",
  authMiddleware.verifyToken,
  getAllInterviewReportController,
);

module.exports = interviewRoute;
