const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://mr-impot-backend.vercel.app/api";

interface RequestOptions {
  headers?: Record<string, string>;
  isFormData?: boolean;
}

async function request<T = any>(
  endpoint: string,
  options?: RequestInit & RequestOptions,
): Promise<T> {
  const { isFormData, ...fetchOptions } = options || {};

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Ajouter le token depuis localStorage (pour les routes protégées)
  const token = localStorage.getItem("sb-access-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Erreur réseau" }));
    throw new Error(error.error || `Erreur ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  login: (email: string, password: string) =>
    request<{
      user: any;
      role: string;
      profile: any;
      session: { access_token: string } | null;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (
    email: string,
    password: string,
    first_name?: string,
    last_name?: string,
  ) =>
    request<{ user: any; session: { access_token: string } | null }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, first_name, last_name }),
      },
    ),

  me: () => request<{ user: any; profile: any }>("/auth/me"),
};

export const publicApi = {
  getCategories: () => request("/public/categories"),
  getDocuments: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/public/documents${query}`);
  },
  getDocument: (id: string) => request(`/public/documents/${id}`),
  downloadDocument: (id: string) =>
    request(`/public/documents/${id}?download=true`),
  getVideos: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/public/videos${query}`);
  },
  getVideo: (id: string) => request(`/public/videos/${id}`),
  searchDocuments: (q: string, mode = "fulltext") =>
    request(`/public/search?q=${encodeURIComponent(q)}&mode=${mode}`),
};