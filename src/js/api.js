// js/api.js
const API_URL = "https://6888970cadf0e59551ba8c1c.mockapi.io/api/cards";

export async function getProductCards() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`Network error: ${resp.status}`);
    const data = await resp.json();

    try {
      localStorage.setItem("cards", JSON.stringify(data));
    } catch (err) {
      // не критично если localStorage недоступен
      console.warn("Не удалось записать в localStorage:", err);
    }

    return data;
  } catch (err) {
    console.warn("Fetch failed, trying local cache:", err);
    const cached = localStorage.getItem("cards");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // если кэш повреждён, пробросим ошибку дальше
        throw err;
      }
    }
    throw err;
  }
}
