import type { AppLocale } from '@/lib/constants';

export interface AppUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AppUser;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatDetail {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatSummary {
  id: string;
  title: string;
  lastMessagePreview: string;
  messageCount: number;
  updatedAt: string;
}

export interface ChatRequest {
  message: string;
  locale: AppLocale;
}
