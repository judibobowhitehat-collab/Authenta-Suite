import { Type } from '@google/genai';

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  VERIFY = 'VERIFY',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPICIOUS = 'SUSPICIOUS'
}

export interface VerificationResult {
  status: VerificationStatus;
  confidenceScore: number;
  extractedData: {
    name?: string;
    documentType?: string;
    expiryDate?: string;
    issueDate?: string;
    documentNumber?: string;
  };
  riskFactors: string[];
  summary: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: VerificationStatus;
}
