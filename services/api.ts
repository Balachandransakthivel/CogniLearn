const API = "http://127.0.0.1:8000";

export const registerUser = async (data: any) => {
    return fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};
