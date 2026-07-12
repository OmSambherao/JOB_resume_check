const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// 1. Keep your Zod schema for backend type validation
const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string()
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    console.log("Generating AI Interview Report... Please wait.");

    // 2. Pure Native Schema Configuration (Gemini native format)
    const nativeGeminiSchema = {
        type: "object",
        properties: {
            matchScore: { 
                type: "integer", 
                description: "A score between 0 and 100 indicating the candidate's profile match." 
            },
            technicalQuestions: {
                type: "array",
                description: "List of technical questions.",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The exact technical question to ask." },
                        intention: { type: "string", description: "Why the interviewer is asking this." },
                        answer: { type: "string", description: "The expected answer and approach." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: "array",
                description: "List of behavioral questions.",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The exact behavioral question to ask." },
                        intention: { type: "string", description: "Why the interviewer is asking this." },
                        answer: { type: "string", description: "The expected answer and approach." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "array",
                description: "List of identified skill gaps.",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string", description: "The specific skill the candidate lacks." },
                        severity: { type: "string", enum: ["low", "medium", "high"], description: "Severity of the gap." }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "array",
                description: "Day-by-day preparation plan.",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "integer", description: "Day number (e.g., 1, 2)." },
                        focus: { type: "string", description: "Main focus for the day." },
                        tasks: { 
                            type: "array", 
                            items: { type: "string" },
                            description: "Specific tasks to complete." 
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            title: { 
                type: "string", 
                description: "The official job title." 
            }
        },
        required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
    };

    const prompt = `
You are an expert technical recruiter and JSON generator.
Analyze the provided Resume, Self Description, and Job Description.

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY a raw, valid JSON object.
2. Your JSON keys MUST exactly match the fields defined in the requested schema layout. Do not invent your own keys.
3. If a list should be empty, return [].

Resume:
${resume}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}
    `;

    try {
        // 3. Call the AI with Native Schema
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: nativeGeminiSchema, // Direct native object passing
                temperature: 0.1 
            }
        });

        let responseText = response.text || "";
        
        // Extract JSON block safely
        const jsonMatch = responseText.match(/\{[\s\S]*\}/); 
        if (!jsonMatch) {
            throw new Error("AI did not return a recognizable JSON object.");
        }

        const cleanJsonString = jsonMatch[0];
        const parsedData = JSON.parse(cleanJsonString);
        
        // 4. Validate with Zod before final return
        return interviewReportSchema.parse(parsedData);

    } catch (error) {
        console.error("❌ AI Generation or Parsing Failed:", error.message);
        if (error.issues) {
            console.error("Zod Validation Issues:", JSON.stringify(error.issues, null, 2));
        }
        throw new Error("Failed to generate a valid interview report. Please try again."); 
    }
}

module.exports = generateInterviewReport;