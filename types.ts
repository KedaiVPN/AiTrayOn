
export enum AppView {
  OUTFIT_SWAP = 'OUTFIT_SWAP',
  IMAGE_EDITOR = 'IMAGE_EDITOR'
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  type: AppView;
  imageUrl: string;
  timestamp: number;
}
