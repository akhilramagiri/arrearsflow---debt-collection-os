
import { GoogleGenAI } from "@google/genai";
import { BucketId, Account } from "../types";
import { BUCKET_RULES } from "../constants";

export const generateCommunicationDraft = async (account: Account) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const bucketInfo = BUCKET_RULES[account.bucket];
  
  const prompt = `
    Draft a highly professional and compliant communication for a customer in debt collection.
    
    Customer Name: ${account.customerName}
    Bucket: ${bucketInfo.name} (${bucketInfo.meaning})
    DPD: ${account.dpd}
    Arrears: $${account.arrearsAmount.toFixed(2)}
    Regulatory Action Required: ${bucketInfo.actions.join(", ")}
    
    Rules:
    - If Bucket 1-2: Keep it friendly, helpful, focus on "supporting their return to good standing".
    - If Bucket 3: Firm but respectful, mention hardship options.
    - If Bucket 4+: Formal legal tone, reference regulatory notices like Section 88(6).
    
    Format the response as:
    Subject: [Subject Line]
    Message: [Message Content]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation failed", error);
    return "Failed to generate AI draft. Please use manual templates.";
  }
};
