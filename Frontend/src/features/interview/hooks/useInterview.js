import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportByID,
} from "../services/Interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../Interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { InterviewId } = useParams();

  if (!context) {
    throw new Error("useinterview must be used in interviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resume,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resume,
      });
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.error("Error generating report:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (reportId) => {
    let response = null;
    setLoading(true);
    try {
      console.log("Fetching report with ID:", reportId);
      response = await getInterviewReportByID(reportId);
      console.log("Report fetched successfully:", response);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.error("Error fetching report by ID:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateAllReports = async () => {
    setLoading(true);
    let response = null;
    try {
      console.log("Fetching all reports...");
      response = await getAllInterviewReports();
      console.log("All reports fetched:", response);
      setReports(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.error("Error fetching all reports:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Auto-load report when component mounts or InterviewId changes
  useEffect(() => {
    if (InterviewId) {
      console.log("Interview ID found, fetching specific report...");
      getReportById(InterviewId);
    } else {
      console.log("No Interview ID, fetching all reports...");
      generateAllReports();
    }
  }, [InterviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    generateAllReports,
    getReportById,
  };
};
