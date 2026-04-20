/**
 * API client for communicating with the TaskMaster FastAPI backend.
 * Base URL defaults to http://localhost:8000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── Token management ────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ── Core fetch wrapper ──────────────────────────────────────────────

async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // If 401 and we have a refresh token, try refreshing once
  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      return fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  return res;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

// ── Helper to parse FastAPI errors ────────────────────────────────────

function getErrorMessage(data: any): string {
  if (!data.detail) return 'An error occurred';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    // If it's a Pydantic validation error array [{msg: "error", loc: [...]}]
    if (data.detail.length > 0 && typeof data.detail[0] === 'object' && data.detail[0].msg) {
      return data.detail.map((err: any) => err.msg).join(', ');
    }
    // If it's a custom error array ["error1", "error2"]
    return data.detail.join(', ');
  }
  return String(data.detail);
}

// ── Auth API ────────────────────────────────────────────────────────

export const authAPI = {
  async register(email: string, password: string, fullName?: string, timezone?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, timezone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(getErrorMessage(data));
    setTokens(data.access_token, data.refresh_token);
    return data;
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(getErrorMessage(data));
    setTokens(data.access_token, data.refresh_token);
    return data;
  },

  async logout() {
    await apiFetch('/auth/logout', { method: 'POST' });
    clearTokens();
  },

  async me() {
    const res = await apiFetch('/auth/me');
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async updateProfile(fullName?: string, timezone?: string) {
    const res = await apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName, timezone }),
    });
    return res.json();
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const res = await apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(getErrorMessage(data));
    return data;
  },
};

// ── Tasks API ───────────────────────────────────────────────────────

export const tasksAPI = {
  async list(params?: { status?: string; project_id?: string; priority?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.project_id) query.set('project_id', params.project_id);
    if (params?.priority) query.set('priority', params.priority);
    const qs = query.toString();
    const res = await apiFetch(`/tasks/${qs ? '?' + qs : ''}`);
    return res.json();
  },

  async get(taskId: string) {
    const res = await apiFetch(`/tasks/${taskId}`);
    return res.json();
  },

  async create(task: Record<string, any>) {
    const res = await apiFetch('/tasks/', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async update(taskId: string, updates: Record<string, any>) {
    const res = await apiFetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async delete(taskId: string) {
    await apiFetch(`/tasks/${taskId}`, { method: 'DELETE' });
  },
};

// ── Projects API ────────────────────────────────────────────────────

export const projectsAPI = {
  async list() {
    const res = await apiFetch('/projects/');
    return res.json();
  },

  async create(project: Record<string, any>) {
    const res = await apiFetch('/projects/', {
      method: 'POST',
      body: JSON.stringify(project),
    });
    return res.json();
  },

  async update(projectId: string, updates: Record<string, any>) {
    const res = await apiFetch(`/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async delete(projectId: string) {
    await apiFetch(`/projects/${projectId}`, { method: 'DELETE' });
  },
};

// ── Reminders API ───────────────────────────────────────────────────

export const remindersAPI = {
  async list() {
    const res = await apiFetch('/reminders/');
    return res.json();
  },

  async create(reminder: Record<string, any>) {
    const res = await apiFetch('/reminders/', {
      method: 'POST',
      body: JSON.stringify(reminder),
    });
    return res.json();
  },

  async delete(reminderId: string) {
    await apiFetch(`/reminders/${reminderId}`, { method: 'DELETE' });
  },
};

// ── AI API ──────────────────────────────────────────────────────────

export const aiAPI = {
  async breakdownTask(taskId: string) {
    const res = await apiFetch(`/ai/breakdown/${taskId}`, { method: 'POST' });
    return res.json();
  },

  async suggestPriority(taskId: string) {
    const res = await apiFetch(`/ai/suggest-priority/${taskId}`, { method: 'POST' });
    return res.json();
  },
};

// ── Health ──────────────────────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
