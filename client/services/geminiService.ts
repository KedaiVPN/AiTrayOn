
import { ImageData } from "../types";

const API_BASE_URL = '/api';

export const outfitSwap = async (target: ImageData, outfit: ImageData): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/outfit-swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ target, outfit }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate outfit swap');
  }

  const data = await response.json();
  return data.image;
};

export const editImageWithText = async (image: ImageData, prompt: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/edit-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image, prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to edit image');
  }

  const data = await response.json();
  return data.image;
};
