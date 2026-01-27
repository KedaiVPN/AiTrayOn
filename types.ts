
export enum AppView {
  OUTFIT_SWAP = 'OUTFIT_SWAP',
  IMAGE_EDITOR = 'IMAGE_EDITOR'
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

// Minimal type definition for Puter.js
declare global {
  interface Window {
    puter: any;
  }
  const puter: any;
}
