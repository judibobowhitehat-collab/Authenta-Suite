import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VerificationResult, VerificationStatus } from "../types";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const verificationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: [
        VerificationStatus.VERIFIED,
        VerificationStatus.REJECTED,
        VerificationStatus.SUSPICIOUS,
        VerificationStatus.PENDING
      ],
      description: "The overall verification status of the document."
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating confidence in the document's authenticity."
    },
    extractedData: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Full name found on the document" },
        documentType: { type: Type.STRING, description: "Type of document (e.g., Passport, ID Card)" },
        expiryDate: { type: Type.STRING, description: "Expiration date if present" },
        issueDate: { type: Type.STRING, description: "Date of issue if present" },
        documentNumber: { type: Type.STRING, description: "Unique document identifier" }
      }
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of potential issues or risk factors detected (e.g., 'blur', 'mismatched fonts')."
    },
    summary: {
      type: Type.STRING,
      description: "A brief executive summary of the analysis."
    }
  },
  required: ["status", "confidenceScore", "riskFactors", "summary"]
};

export const analyzeDocument = async (base64Image: string, mimeType: string): Promise<VerificationResult> => {
  try {
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: `Analyze this image as an identity document or official record. 
            Check for visual authenticity markers, consistency, and readability. 
            Extract key details and assess if it appears legitimate or suspicious.
            Provide the output strictly in JSON format matching the schema.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: verificationSchema,
        temperature: 0.1 // Low temperature for more deterministic/analytical results
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI model");
    }

    const result = JSON.parse(text) as VerificationResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze document. Please try again.");
  }
};
