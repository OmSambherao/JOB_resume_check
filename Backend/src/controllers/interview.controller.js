const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const inteviewReportModel = require("../models/interviewReport.model");

/**
 * @description generate interview report from the interviewer data 
 */
async function generateInterviewReportController(req, res) {
    try {
        // 1. Ensure file exists
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "Resume PDF file is required." });
        }

        const { selfDescription, jobDescription } = req.body;

        // 2. Catch missing form data early
        if (!jobDescription) {
            return res.status(400).json({ message: "jobDescription is required in the form data." });
        }

        // 3. Parse PDF
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();

        // 4. Generate AI Report
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription: selfDescription || "",
            jobDescription
        });

        // Log AI response to debug if it misses fields
        console.log("AI Output successfully generated.");
        console.log(interViewReportByAi);

        // 5. Save to Database (Added fallback for title if AI misses it)
        const interviewReport = await inteviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            title: interViewReportByAi.title || "Software Engineer", // Fallback to prevent validation error
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
}

/**
 * @description get interview report by interview ID 
 */
async function getInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        
        console.log("Fetching interview with ID:", interviewId, "for user:", req.user.id);
        
        const interviewReport = await inteviewReportModel.findById(interviewId);

        if (!interviewReport) {
            return res.status(400).json({
                message: "Interview report not found"
            });
        }

        // Check if the report belongs to the logged-in user
        if (interviewReport.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: This report does not belong to you"
            });
        }

        res.status(200).json({
            message: "Got interview report successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
}

/**
 * @description get all interview reports for the logged-in user
 */
async function getAllInterviewReportController(req, res) {
    try {
        const interviewReports = await inteviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-__v -resume -user -jobDescription -selfDescription -createdAt -updatedAt -preparationPlan -skillGaps -technicalQuestions -behavioralQuestions");

        res.status(200).json({
            message: "Got all interview reports successfully",
            interviewReport: interviewReports
        });

    } catch (error) {
        console.error("Error fetching all interview reports:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
}

module.exports = { generateInterviewReportController, getInterviewReportController, getAllInterviewReportController };