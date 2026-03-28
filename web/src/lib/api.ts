import type {
  AppUser,
  AuthResponse,
  ChatDetail,
  ChatRequest,
  ChatSummary,
} from '@/types/api';

type RequestOptions = {
  method?: 'GET' | 'POST';
  token?: string;
  body?: unknown;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export async function login(payload: {
  email: string;
  password: string;
}) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function register(payload: {
  email: string;
  password: string;
}) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function fetchCurrentUser(token: string) {
  return apiRequest<AppUser>('/auth/me', {
    token,
  });
}

export async function fetchChatSummaries(token: string) {
  return apiRequest<ChatSummary[]>('/chats', {
    token,
  });
}

export async function fetchChatDetail(token: string, chatId: string) {
  return apiRequest<ChatDetail>(`/chats/${chatId}`, {
    token,
  });
}

export async function createChat(token: string, payload: ChatRequest) {
  return apiRequest<ChatDetail>('/chats', {
    method: 'POST',
    token,
    body: payload,
  });
}

export async function sendChatMessage(
  token: string,
  chatId: string,
  payload: ChatRequest,
) {
  return apiRequest<ChatDetail>(`/chats/${chatId}/messages`, {
    method: 'POST',
    token,
    body: payload,
  });
}

async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const url = new URL(path, ensureTrailingSlash(API_URL));
  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload) ?? `Request failed with status ${response.status}.`,
      response.status,
      payload,
    );
  }

  return payload as T;
}

function ensureTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`;
}

async function parsePayload(response: Response) {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return null;
}

function extractErrorMessage(payload: unknown) {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = payload.message;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.filter((item) => typeof item === 'string').join(' ');
    }
  }

  return null;
}
