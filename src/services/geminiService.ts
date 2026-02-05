
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateDesignAdvice = async (roomDescription: string, wallpaperName: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a luxury interior design consultant for Stenna Wallpaper, provide a brief, editorial-style advice (max 60 words) on how to style the '${wallpaperName}' wallpaper in a ${roomDescription}. Use sophisticated, Zara-like language.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Transform your space with the curated textures of Stenna. Pair with minimalist furniture for an editorial finish.";
  }
};

export const analyzeRoomPhoto = async (base64Image: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        { text: "Analyze this room photo for a luxury wallpaper brand. Identify the dominant color palette and interior design style. Recommend which category of wallpaper (Modern, Classic, Textured, or Nature) would suit it best. Return the result in a JSON format." }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING },
            palette: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING, enum: ['Modern', 'Classic', 'Textured', 'Nature'] },
            rationale: { type: Type.STRING }
          },
          required: ['style', 'palette', 'recommendation', 'rationale']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};

export const generateCustomWallpaper = async (prompt: string, category: string = 'Modern') => {
  const ai = getAI();
  
  const categoryInstructions: Record<string, string> = {
    'Modern': `Architectural & Contemporary. Visual direction: Inspired by modern architecture and interior minimalism. Abstract or geometric compositions. Soft linear forms, blocks, or gradients. Controlled negative space. Palette: warm grey, sand, taupe, off-white, charcoal. Finish: Matte, refined surface.`,
    'Classic': `Timeless & Editorial. Visual direction: Inspired by European heritage interiors. Soft symmetrical patterns or delicate ornamental rhythms. Traditional influences reinterpreted in a modern, restrained way. No heavy ornamentation. Palette: Cream, ivory, warm beige, muted gold, stone. Finish: Soft satin or subtle sheen.`,
    'Textured': `Material & Depth. Visual direction: Inspired by plaster, limewash, linen, stone, or concrete. Organic tonal variation. Imperfect, handcrafted feel. No visible pattern repetition. Palette: Off-white, clay, sand, warm grey, mineral tones. Finish: Matte or chalky texture.`,
    'Nature': `Soft, Organic, Sophisticated. Visual direction: Abstracted natural forms (leaves, branches, florals, organic movement). Hand-painted or watercolor softness. Gentle flow and rhythm. Palette: Sage, olive, stone, sand, mist grey. Finish: Calm, poetic, airy.`
  };

  const masterPrompt = `
    Create a luxury, editorial-style product image for a premium wallpaper brand called Stenna Wallpaper, 
    inspired by the minimalist, high-fashion product photography style of Zara.com.
    
    PRODUCT CATEGORY: ${category}
    CATEGORY DIRECTION: ${categoryInstructions[category] || categoryInstructions['Modern']}
    
    SPECIFIC CONCEPT: ${prompt}.
    
    STRICT VISUAL RULES (STENNA MANIFESTO):
    - Editorial fashion photography style
    - Minimalism over decoration
    - Neutral luxury palette (no bold graphics, no high contrast)
    - Soft natural lighting only, no harsh shadows
    - A clean hero image showing the wallpaper applied on a large, modern interior wall
    - Neutral luxury interior (beige / off-white / stone tones)
    - No furniture clutter, wallpaper must be fully visible and centered
    - No visible branding, logos, or text inside the image.
    - Calm, aspirational, curated atmosphere.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: masterPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};
