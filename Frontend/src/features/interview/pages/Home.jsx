import React, { useState, useRef } from "react";
import { UploadCloud, Briefcase, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";

function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();
  const { loading, generateReport  , reports  } = useInterview();
  const navigate = useNavigate();

  const handleGenerateReport = async (e) => {
    e.preventDefault(); // Prevent form default submission

    const resume = resumeInputRef.current.files[0];

    // Validation
    if (!resume && !selfDescription) {
      alert("Please upload a resume or provide a self description");
      return;
    }

    if (!jobDescription) {
      alert("Please enter a job description");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        resume,
        selfDescription,
      });

      if (data && data._id) {
        navigate(`/interview/${data._id}`);
      } else {
        alert("Failed to generate report. Please try again.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("An error occurred while generating the report");
    }
  };

  if (loading) {
    return (
      <div className="bg-black flex align-middle items-center text-white h-screen justify-center ">
        <h5>loading ...</h5>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            Create Your Custom{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Interview Plan
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Let our AI analyze the job requirements and your unique profile to
            build a winning interview strategy.
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleGenerateReport} className="overflow-hidden rounded-2xl border border-gray-800 bg-[#111318] shadow-2xl">
          <div className="grid lg:grid-cols-2">
            {/* Left */}
            <div className="border-r border-gray-800 p-8">
              <div className="mb-6 flex items-center gap-3">
                <Briefcase className="text-pink-500" size={20} />
                <h2 className="text-xl font-semibold">
                  Target Job Description
                </h2>

                <span className="ml-auto rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-400">
                  Required
                </span>
              </div>

              <textarea
                rows={18}
                placeholder="Paste the full job description here...e.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript, system design..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full resize-none rounded-xl border border-gray-700 bg-[#1A1D24] p-5 text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
              />

              <div className="mt-2 text-right text-sm text-gray-500">
                {jobDescription.length} / 5000 chars
              </div>
            </div>

            {/* Right */}
            <div className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <User className="text-pink-500" size={20} />
                <h2 className="text-xl font-semibold">Your Profile</h2>
              </div>

              {/* Upload */}
              <label className="mb-8 block">
                <p className="mb-3 font-medium">
                  Upload Resume
                  <span className="ml-2 text-sm text-pink-400">(PDF)</span>
                </p>

                <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-700 bg-[#1A1D24] p-10 transition hover:border-pink-500">
                  <div className="flex flex-col items-center">
                    <div className="mb-5 rounded-full bg-pink-500/10 p-4">
                      <UploadCloud size={32} className="text-pink-500" />
                    </div>

                    <p className="font-medium">
                      Click to upload or drag & drop
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      PDF only (Max 5MB)
                    </p>

                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      ref={resumeInputRef}
                      onChange={(e) => {
                        // Optional: Add file size validation
                        const file = e.target.files[0];
                        if (file && file.size > 5 * 1024 * 1024) {
                          alert("File size must be less than 5MB");
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>

                {resumeInputRef.current?.files[0] && (
                  <p className="mt-2 text-sm text-green-400">
                    ✓ {resumeInputRef.current.files[0].name}
                  </p>
                )}
              </label>

              {/* Self Description */}
              <div>
                <label className="mb-3 block font-medium">
                  Quick Self Description
                </label>

                <textarea
                  rows={5}
                  placeholder="Briefly describe your experience, key skills, achievements, and career goals..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  className="w-full resize-none rounded-xl border border-gray-700 bg-[#1A1D24] p-4 placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
                />

                <div className="mt-5 rounded-lg border border-blue-700 bg-blue-900/20 p-4 text-sm text-blue-300">
                  Either a Resume or a Self Description is required to generate
                  a personalized interview strategy.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-800 bg-[#0E1015] p-6 lg:flex-row">
            <p className="text-sm text-gray-500">
              AI-Powered Strategy Generation • Approx 30s
            </p>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-500 px-10 py-4 font-semibold transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "✨ Generate My Interview Strategy"}
            </button>
          </div>
        </form>


        {reports.length > 0 && (
            <section className="container mx-auto my-8 p-6 bg-black rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-white">My Recent Reports</h2>
                <ul className="space-y-4">
                  {reports.map((report) => (
                    <li key={report._id} className="flex justify-between items-center p-4 bg-gray-900 rounded-md hover:bg-gray-800 transition-colors duration-200">
                      <a href={`/interview/${report._id}`} className=" text-pink-400 hover:underline text-lg font-medium">{report.title }</a>
                      <p className="text-gray-400 text-sm">Generated on {report.createdAt} </p>
                    </li>
                  ))  }
                </ul>
            </section>

        )}


        

        {/* Footer */}
        <div className="mt-10 flex justify-center gap-10 text-sm text-gray-500">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </div>
    </div>
  );
}

export default Home;