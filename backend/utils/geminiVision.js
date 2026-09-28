import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sends the uploaded image (+ optional user text) to Gemini Vision
 * and asks it to return a structured JSON report.
 *
 * @param {string} imageUrl - public Cloudinary URL of the uploaded image
 * @param {string} userText - optional free-text description from the citizen
 * @returns {Promise<object>} { category, severity, description, note }
 */
export const analyzeRoadIssue = async (imageUrl, userText = "") => {
  // NOTE: model name may need updating - check
  // https://ai.google.dev/gemini-api/docs/models for the current
  // vision-capable model available on your API key.
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an assistant for a civic road-issue reporting app in Tamil Nadu, India.
Look at the road/street image and any citizen-written note below, then respond
with ONLY valid JSON (no markdown fences, no extra text) in this exact shape:

{
  "category": "Pothole | Road Crack | Waterlogging | Fallen Tree | Broken Traffic Signal | Missing Traffic Sign | Garbage on Road | Other",
  "severity": "Low | Medium | High | Critical",
  "description": "one clear sentence describing the issue and why it matters for traffic/safety",
  "note": "one short sentence explaining why you picked that severity"
}

Severity guide:
- Low: minor, cosmetic, low traffic impact
- Medium: noticeable hazard, moderate traffic impact
- High: significant hazard, blocks part of the road or affects vehicles/pedestrians directly
- Critical: severe danger to life (e.g. structural collapse, deep waterlogging, major junction hazard)

Citizen's note (may be empty): "${userText}"
`;

  // Fetch the image and convert to base64 for the API
  const imageResp = await fetch(imageUrl);
  const buffer = Buffer.from(await imageResp.arrayBuffer());
  const base64Image = buffer.toString("base64");
  const mimeType = imageResp.headers.get("content-type") || "image/jpeg";

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType } },
  ]);

  const text = result.response.text().trim();

  // Strip accidental markdown fences before parsing
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    // Fallback if the model doesn't return clean JSON
    return {
      category: "Other",
      severity: "Medium",
      description: userText || "Road issue reported by citizen.",
      note: "AI could not parse a structured response; defaulted values used.",
    };
  }
};
