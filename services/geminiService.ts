import { ImageData } from "../types";

export const outfitSwap = async (target: ImageData, outfit: ImageData): Promise<string> => {
  if (typeof puter === 'undefined') {
    throw new Error("Puter.js library not loaded");
  }

  // Puter.js chat interface for Multimodal input (using Google Gemini schema)
  const response = await puter.ai.chat(
    {
      parts: [
        {
          inlineData: {
            data: target.base64.split(',')[1],
            mimeType: target.mimeType,
          },
        },
        {
          inlineData: {
            data: outfit.base64.split(',')[1],
            mimeType: outfit.mimeType,
          },
        },
        {
          text: "This is a high-fidelity outfit swap task. The first image contains a person. The second image contains a reference outfit. Generate a new version of the first image where the person is wearing the exact outfit from the second image. Maintain the person's pose, identity, and facial expression. The lighting and background should remain consistent and professional. Return only the generated image data.",
        },
      ]
    },
    { model: 'gemini-2.0-flash' }
  );

  let content = "";
  if (typeof response === 'object' && response?.message?.content) {
    content = response.message.content;
  } else if (typeof response === 'string') {
    content = response;
  }

  // Basic validation to check if the result is likely an image
  if (content.startsWith("data:image") || content.startsWith("http")) {
    return content;
  }

  // If the model refuses or returns text, throw an error to be handled by the UI
  // This prevents rendering text as an image source.
  throw new Error("AI did not return a valid image. It might have returned text instead: " + content.substring(0, 50) + "...");
};

export const editImageWithText = async (image: ImageData, prompt: string): Promise<string> => {
   if (typeof puter === 'undefined') {
    throw new Error("Puter.js library not loaded");
  }

  const response = await puter.ai.chat(
    {
      parts: [
        {
          inlineData: {
            data: image.base64.split(',')[1],
            mimeType: image.mimeType,
          },
        },
        {
          text: `Please edit the provided image based on this instruction: "${prompt}". Return only the modified image.`,
        },
      ]
    },
    { model: 'gemini-2.0-flash' }
  );

  let content = "";
  if (typeof response === 'object' && response?.message?.content) {
    content = response.message.content;
  } else if (typeof response === 'string') {
    content = response;
  }

  if (content.startsWith("data:image") || content.startsWith("http")) {
    return content;
  }

  throw new Error("AI editing failed or returned text instead of an image.");
};
