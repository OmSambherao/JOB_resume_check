import React, { useState } from "react";
import { useInterview } from "../hooks/useInterview";

function Interview() {
  const { report, loading } = useInterview();
  const data = report;
  const [activeTab, setActiveTab] = useState("technical");

  // Loading state
  if (loading) {
    return (
      <div className="bg-black flex align-middle items-center text-white h-screen justify-center">
        <h5>Loading interview data...</h5>
      </div>
    );
  }

  // No data loaded
  if (!data) {
    return (
      <div className="bg-black flex align-middle items-center text-white h-screen justify-center">
        <h5>No interview data found. Please generate a report first.</h5>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "technical":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">
              Technical Questions
            </h2>
            {data.technicalQuestions?.length > 0 ? (
              data.technicalQuestions.map((q, index) => (
                <div
                  key={index}
                  className="bg-[#1c1d22] border border-gray-800 rounded-xl p-5 shadow-lg"
                >
                  <p className="font-semibold text-lg text-white mb-3">
                    {q.question}
                  </p>
                  <div className="text-sm text-gray-400 mb-2">
                    <span className="font-medium text-pink-400">Intention:</span>{" "}
                    {q.intention}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="font-medium text-purple-400">
                      Target Answer:
                    </span>{" "}
                    {q.answer}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No technical questions available.</p>
            )}
          </div>
        );
      case "behavioral":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">
              Behavioral Questions
            </h2>
            {data.behavioralQuestions?.length > 0 ? (
              data.behavioralQuestions.map((q, index) => (
                <div
                  key={index}
                  className="bg-[#1c1d22] border border-gray-800 rounded-xl p-5 shadow-lg"
                >
                  <p className="font-semibold text-lg text-white mb-3">
                    {q.question}
                  </p>
                  <div className="text-sm text-gray-400 mb-2">
                    <span className="font-medium text-pink-400">Intention:</span>{" "}
                    {q.intention}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="font-medium text-purple-400">
                      Target Answer:
                    </span>{" "}
                    {q.answer}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No behavioral questions available.</p>
            )}
          </div>
        );
      case "preparation":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">
              Preparation Plan
            </h2>
            {data.preparationPlan?.length > 0 ? (
              data.preparationPlan.map((plan, index) => (
                <div
                  key={index}
                  className="bg-[#1c1d22] border border-gray-800 rounded-xl p-5 shadow-lg"
                >
                  <h3 className="font-semibold text-lg text-white mb-3">
                    Day {plan.day}:{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                      {plan.focus}
                    </span>
                  </h3>
                  <ul className="space-y-2">
                    {plan.tasks?.length > 0 ? (
                      plan.tasks.map((task, i) => (
                        <li
                          key={i}
                          className="text-gray-400 flex items-center gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                          {task}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm">
                        No tasks scheduled for this day
                      </li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No preparation plan available.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 font-sans flex gap-6 text-gray-200">
      {/* LEFT COLUMN: Navigation Sidebar */}
      <div className="w-1/4 bg-[#141518] border border-gray-800/60 rounded-2xl p-4 flex flex-col gap-2 h-fit">
        <button
          onClick={() => setActiveTab("technical")}
          className={`p-4 rounded-xl font-medium text-left transition-all duration-200 ${
            activeTab === "technical"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
              : "text-gray-400 hover:bg-[#1c1d22] hover:text-gray-200"
          }`}
        >
          Technical Questions
        </button>

        <button
          onClick={() => setActiveTab("behavioral")}
          className={`p-4 rounded-xl font-medium text-left transition-all duration-200 ${
            activeTab === "behavioral"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
              : "text-gray-400 hover:bg-[#1c1d22] hover:text-gray-200"
          }`}
        >
          Behavioral Questions
        </button>

        <button
          onClick={() => setActiveTab("preparation")}
          className={`p-4 rounded-xl font-medium text-left transition-all duration-200 ${
            activeTab === "preparation"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
              : "text-gray-400 hover:bg-[#1c1d22] hover:text-gray-200"
          }`}
        >
          Preparation Plan
        </button>
      </div>

      {/* CENTER COLUMN: Main Content Area */}
      <div className="w-1/2 bg-[#141518] border border-gray-800/60 rounded-2xl p-8 h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
        {renderMainContent()}
      </div>

      {/* RIGHT COLUMN: Score and Skills */}
      <div className="w-1/4 flex flex-col gap-6 h-[calc(100vh-3rem)]">
        {/* Top Right: Score Circle Panel */}
        <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg">
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            {/* Gradient border effect for the circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 opacity-20 blur-md"></div>
            <div className="relative w-full h-full rounded-full border-4 border-pink-500 flex items-center justify-center bg-[#0a0a0a]">
              <span className="text-3xl font-bold text-white">
                {data.matchScore ?? "N/A"}%
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            Score Match
          </span>
        </div>

        {/* Bottom Right: Skill Gaps Panel */}
        <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 flex-1 flex flex-col shadow-lg overflow-hidden">
          <div className="flex justify-between border-b border-gray-800 pb-4 mb-4">
            <span className="font-semibold text-sm text-gray-400 uppercase tracking-wider">
              Skill Gap
            </span>
            <span className="font-semibold text-sm text-gray-400 uppercase tracking-wider">
              Severity
            </span>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto">
            {data.skillGaps?.length > 0 ? (
              data.skillGaps.map((gap, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-[#1c1d22] p-3 rounded-lg border border-gray-800/50"
                >
                  <span className="font-medium text-gray-200 text-sm">
                    {gap.skill}
                  </span>
                  <span
                    className={`uppercase text-[10px] font-bold px-2.5 py-1 rounded-md ${
                      gap.severity === "high"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : gap.severity === "medium"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}
                  >
                    {gap.severity}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No skill gaps identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;