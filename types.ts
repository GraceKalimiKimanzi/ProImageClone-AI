
export interface ProSettings {
  outfit: string;
  background: string;
  lighting: string;
  expression: string;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  CAPTURING = 'CAPTURING',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
