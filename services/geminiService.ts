
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult, MapResource, CarbonScope } from "../types";

export const runSustainabilityAudit = async (
  fileData: string, // Base64 or raw CSV text
  mimeType: string,
  userId: string,
  location?: { lat: number; lng: number }
): Promise<AuditResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      businessName: { type: Type.STRING },
      industry: { type: Type.STRING },
      estimatedCarbonScore: { type: Type.NUMBER },
      industryBenchmark: { type: Type.NUMBER },
      certificationLevel: { type: Type.STRING, enum: ["Bronze", "Silver", "Gold", "Platinum"] },
      dataPoints: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            source: { type: Type.STRING },
            value: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            description: { type: Type.STRING },
            scope: { type: Type.STRING, enum: ["Scope 1", "Scope 2", "Scope 3"] }
          },
          required: ["source", "value", "unit", "scope"]
        }
      },
      quickWins: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            difficulty: { type: Type.STRING, enum: ["Easy", "Moderate", "Challenging"] },
            category: { type: Type.STRING, enum: ["Energy", "Logistics", "Waste", "Procurement"] },
            financialSave: { type: Type.STRING },
            taxBenefit: { type: Type.STRING }
          },
          required: ["title", "description", "impact", "difficulty", "category", "financialSave"]
        }
      },
      suppliers: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            emailDraft: { type: Type.STRING }
          }
        }
      },
      solarROI: {
        type: Type.OBJECT,
        properties: {
          paybackMonths: { type: Type.NUMBER },
          estimatedCost: { type: Type.NUMBER },
          monthlySaving: { type: Type.NUMBER },
          solarPotential: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
        }
      },
      summary: { type: Type.STRING }
    },
    required: ["businessName", "industry", "estimatedCarbonScore", "industryBenchmark", "certificationLevel", "dataPoints", "quickWins", "suppliers", "summary"]
  };

  const systemInstruction = `
    You are the "Strategic Sustainability Partner," a world-class senior expert in carbon accounting (GHG Protocol).
    Objective: Help small businesses reach Net Zero efficiently.
    - Analyze the provided data (PDF/Image binary or CSV text).
    - Assign a Certification Level (Bronze-Platinum) based on their benchmark and current initiatives.
    - Link wins to local tax benefits or incentives.
    - Focus on immediate cash-flow improvements alongside carbon reduction.
  `;

  // Determine if we are dealing with text (CSV) or binary (PDF/Image)
  const contentPart = mimeType === 'text/csv' 
    ? { text: `CSV Data for Analysis:\n${fileData}` }
    : { inlineData: { data: fileData, mimeType: mimeType } };

  const prompt = `
    Perform a professional audit of this operational evidence. 
    Location: Lat ${location?.lat}, Lng ${location?.lng}.
    - Extract and categorize emissions by Scope 1, 2, 3.
    - If CSV, carefully sum up columns related to consumption.
    - Design a Supplier Carbon Data Request email.
    - Calculate Solar ROI based on detected energy patterns.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }, contentPart] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        tools: [{ googleSearch: {} }]
      }
    });

    const result = JSON.parse(response.text);
    const s1 = result.dataPoints.filter((d: any) => d.scope === 'Scope 1').reduce((a: number, c: any) => a + c.value, 0);
    const s2 = result.dataPoints.filter((d: any) => d.scope === 'Scope 2').reduce((a: number, c: any) => a + c.value, 0);
    const s3 = result.dataPoints.filter((d: any) => d.scope === 'Scope 3').reduce((a: number, c: any) => a + c.value, 0);

    return {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      businessName: result.businessName || "Valued Client",
      industry: result.industry || "SME",
      auditDate: new Date().toISOString(),
      estimatedCarbonScore: result.estimatedCarbonScore || 0,
      industryBenchmark: result.industryBenchmark || 50,
      certificationLevel: result.certificationLevel || 'Bronze',
      trend: 'neutral',
      dataPoints: result.dataPoints || [],
      quickWins: result.quickWins || [],
      suppliers: result.suppliers || [],
      summary: result.summary || "Audit complete.",
      scopeBreakdown: {
        scope1: s1 || (result.estimatedCarbonScore * 0.1),
        scope2: s2 || (result.estimatedCarbonScore * 0.3),
        scope3: s3 || (result.estimatedCarbonScore * 0.6)
      },
      solarROI: result.solarROI
    };
  } catch (error) {
    console.error("Audit error:", error);
    throw new Error("Analysis failed. Please ensure file content is clear and readable.");
  }
};

export const findSustainableResources = async (
  lat: number,
  lng: number
): Promise<{ text: string; resources: MapResource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Search for sustainable business resources, government environmental grants, and carbon reduction agencies near coordinates ${lat}, ${lng}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const text = response.text || "No summary available.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const resources: MapResource[] = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Sustainability Partner",
        uri: chunk.web.uri,
        type: "Local Support"
      }));
    return { text, resources };
  } catch (error) {
    return { text: "Search temporarily unavailable.", resources: [] };
  }
};
