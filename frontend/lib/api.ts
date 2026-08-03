const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options?.headers as Record<string, string>),
  };
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  // Handle 204 No Content responses (like DELETE)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const authAPI = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string; role: string }) =>
    fetchAPI('/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    fetchAPI('/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchAPI('/logout', { method: 'POST' }),
  getUser: () => fetchAPI('/user'),
};

export const guestsAPI = {
  getAll: () => fetchAPI('/guests'),
  getOne: (id: number) => fetchAPI(`/guests/${id}`),
  create: (data: any) => fetchAPI('/guests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/guests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/guests/${id}`, { method: 'DELETE' }),
};

export const vendorsAPI = {
  getAll: () => fetchAPI('/vendors'),
  getOne: (id: number) => fetchAPI(`/vendors/${id}`),
  create: (data: any) => fetchAPI('/vendors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/vendors/${id}`, { method: 'DELETE' }),
};

export const tasksAPI = {
  getAll: () => fetchAPI('/tasks'),
  getOne: (id: number) => fetchAPI(`/tasks/${id}`),
  create: (data: any) => fetchAPI('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/tasks/${id}`, { method: 'DELETE' }),
};

export const budgetAPI = {
  getAll: () => fetchAPI('/budget-items'),
  getOne: (id: number) => fetchAPI(`/budget-items/${id}`),
  create: (data: any) => fetchAPI('/budget-items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/budget-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/budget-items/${id}`, { method: 'DELETE' }),
  getSummary: () => fetchAPI('/budget/summary'),
};
