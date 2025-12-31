
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult, MapResource, CarbonScope } from "../types";

const API_KEY = process.env.API_KEY || "";

export const runSustainabilityAudit = async (
  fileData: string,
  mimeType: string,
  userId: string,
  location?: { lat: number; lng: number }
): Promise<AuditResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      businessName: { type: Type.STRING },
      industry: { type: Type.STRING },
      estimatedCarbonScore: { type: Type.NUMBER },
      industryBenchmark: { type: Type.NUMBER, description: "0 for leader, 100 for high emitter compared to peers" },
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
            financialSave: { type: Type.STRING }
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
            emailDraft: { type: Type.STRING, description: "Professional email asking for their ESG/carbon report" }
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
    required: ["businessName", "industry", "estimatedCarbonScore", "industryBenchmark", "dataPoints", "quickWins", "suppliers", "summary"]
  };

  const systemInstruction = `
    You are the "EcoTrack Strategic Consultant," a world-class expert in carbon accounting (GHG Protocol) and SME sustainability.
    Your objective is to help small business owners move from "carbon confusion" to "carbon neutral."
    Analyze utility bills, shipping logs, and waste data.
    - Tone: Professional, encouraging, action-oriented, and jargon-free.
    - Financial Link: Connect every green win to a financial saving.
    - Accuracy: If data is missing or blurry, mention it in the summary.
    - Solar ROI: Use current energy rates and weather patterns for the provided coordinates (or general region) to estimate solar payback.
  `;

  const prompt = `
    Analyze this document for an SME.
    Location Context: Lat ${location?.lat}, Lng ${location?.lng}.
    1. Extract metrics and categorize by Scope 1, 2, 3.
    2. Determine industry benchmark score (0-100).
    3. Identify suppliers mentioned and draft carbon request emails for them.
    4. Calculate Solar ROI if applicable to their energy usage.
    5. Provide 3 Quick Wins with financial savings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: fileData,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        tools: [{ googleSearch: {} }]
      }
    });

    const result = JSON.parse(response.text);
    
    const scope1 = result.dataPoints.filter((d: any) => d.scope === 'Scope 1').reduce((a: number, c: any) => a + c.value, 0);
    const scope2 = result.dataPoints.filter((d: any) => d.scope === 'Scope 2').reduce((a: number, c: any) => a + c.value, 0);
    const scope3 = result.dataPoints.filter((d: any) => d.scope === 'Scope 3').reduce((a: number, c: any) => a + c.value, 0);

    return {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      businessName: result.businessName || "Unknown Business",
      industry: result.industry || "General SME",
      auditDate: new Date().toISOString(),
      estimatedCarbonScore: result.estimatedCarbonScore || 0,
      industryBenchmark: result.industryBenchmark || 50,
      trend: Math.random() > 0.5 ? 'down' : 'up',
      dataPoints: result.dataPoints || [],
      quickWins: result.quickWins || [],
      suppliers: result.suppliers || [],
      summary: result.summary || "Analysis complete.",
      scopeBreakdown: {
        scope1: scope1 || (result.estimatedCarbonScore * 0.2),
        scope2: scope2 || (result.estimatedCarbonScore * 0.5),
        scope3: scope3 || (result.estimatedCarbonScore * 0.3)
      },
      solarROI: result.solarROI
    };
  } catch (error) {
    console.error("Error in strategic audit:", error);
    throw new Error("Failed to process the document strategy.");
  }
};

export const findSustainableResources = async (lat: number, lng: number): Promise<{text: string, resources: MapResource[]}> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find recycling centers, waste management services, and solar energy consultants near this location.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const resources: MapResource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.maps) {
        resources.push({
          title: chunk.maps.title || "Sustainable Resource",
          uri: chunk.maps.uri,
          type: "Map Resource"
        });
      }
    });

    return {
      text: response.text || "Here are some sustainable resources near your business location.",
      resources
    };
  } catch (error) {
    console.error("Maps grounding error:", error);
    return { text: "Could not fetch local resources.", resources: [] };
  }
};
