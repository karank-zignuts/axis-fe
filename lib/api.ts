import type { AuthResponse, ChecklistItem, TradingProfile, User } from '@/types';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const API_URL = rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`;
const TOKEN_KEY = 'axis-access-token';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export function getStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.auth !== false) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : Array.isArray(payload?.message)
          ? payload.message.join(', ')
          : 'Request failed.';
    throw new Error(message);
  }

  return payload as T;
}

export function signup(payload: { name: string; email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/signup', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiRequest<User>('/user/me');
}

export function resetOnboarding() {
  return apiRequest<User>('/user/reset-onboarding', {
    method: 'POST',
  });
}

export function getChecklist() {
  return apiRequest<ChecklistItem[]>('/checklist');
}

export function updateChecklistItem(id: string, completed: boolean) {
  return apiRequest<ChecklistItem>(`/checklist/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  });
}

type StreamHandlers = {
  onItem: (item: { index: number; text: string }) => void;
  onDone?: (payload: { count: number }) => void;
  onError?: (message: string) => void;
};

export async function streamChecklist(profile: TradingProfile, handlers: StreamHandlers) {
  const token = getStoredToken();
  const response = await fetch(`${API_URL}/ai/generate-checklist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? 'Unable to start checklist stream.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';

    for (const block of blocks) {
      const event = parseSseBlock(block);
      if (!event) {
        continue;
      }

      if (event.event === 'item') {
        handlers.onItem(event.data as { index: number; text: string });
      }

      if (event.event === 'done') {
        handlers.onDone?.(event.data as { count: number });
      }

      if (event.event === 'error') {
        const payload = event.data as { message?: string };
        const message = payload.message ?? 'Checklist generation failed.';
        handlers.onError?.(message);
        throw new Error(message);
      }
    }
  }
}

function parseSseBlock(block: string) {
  const lines = block.split('\n');
  const eventName = lines
    .find((line) => line.startsWith('event: '))
    ?.replace('event: ', '')
    .trim();
  const data = lines
    .filter((line) => line.startsWith('data: '))
    .map((line) => line.replace('data: ', ''))
    .join('');

  if (!eventName || !data) {
    return null;
  }

  return {
    event: eventName,
    data: JSON.parse(data) as unknown,
  };
}
