export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("sympto-care-token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("sympto-care-token");
            localStorage.removeItem("sympto-care-user");
            window.location.href = "/login";
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
}
