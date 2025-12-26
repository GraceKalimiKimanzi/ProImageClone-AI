
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ProSettings } from "../types";

export const generateProfessionalPhoto = async (
  base64Image: string,
  settings: ProSettings
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Clean the base64 string
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const prompt = `
    Generate a professional 4k high-resolution upper-body portrait based on the person in the source photo.
    
    CRITICAL INSTRUCTION: The face, facial features, eyes, nose, mouth, and overall identity of the person MUST REMAIN EXACTLY THE SAME as the source image. Do not change her appearance, age, or facial structure. This is an authentic AI Clone that must look 100% identical to the original person.
    
    Aesthetic & Vibe:
    - Theme: Elegant, classy, and highly sophisticated.
    - Mood: Poised, graceful, and quietly confident.
    - Grooming: Polished and refined appearance.
    
    Composition & Framing:
    - Framing: Medium shot showing the full head (do not crop the top of the head) and the upper body down to the waist.
    - Hands & Nails: Both hands must be clearly visible and positioned with grace. Her nails must be neatly manicured, elegant, and clean, with a sophisticated polish.
    - Pose: Seated comfortably and upright at a high-end professional desk, facing the camera directly in an executive "facecam" style.
    
    Modifications requested:
    1. Attire: Change the clothing to ${settings.outfit}. The outfit should look expensive, tailored, and perfectly fitted.
    2. Environment: Place her in a ${settings.background}.
    3. Lighting: Apply professional ${settings.lighting}, emphasizing a soft glow that highlights her features gracefully.
    
    Quality: Cinematic, sharp focus on the subject, high-end professional studio photography, realistic skin and fabric textures, 8k resolution.
    
    The goal is a perfect professional shot where she looks exceptionally elegant and classy, while her identity and facial features remain entirely unchanged.
  `.trim();

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No response parts received from Gemini API");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image was generated in the response");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
