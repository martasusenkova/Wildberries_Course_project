export const MAX_HISTORY = 5;
export const SEARCH_HISTORY_KEY = "searchHistory";

// Сохранение истории поиска
export function saveQueryToHistory(query) {
  if (!query) return;

  let history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];

  // Удаляем дубликаты
  history = history.filter((item) => item !== query);

  // Добавляем в начало
  history.unshift(query);

  // Обрезаем до максимума
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

export function getSearchHistory() {
  return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
}

export function showSearchHistory(inputSearch) {
  const history = getSearchHistory();
  if (!history.length) return;

  const dropdown = document.createElement("ul");
  dropdown.classList.add("search-history");

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("search-history-item");

    li.addEventListener("mousedown", () => {
      inputSearch.value = item;
      inputSearch.focus();
      inputSearch.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    dropdown.appendChild(li);
  });

  // Удалим старый список, если есть
  const old = document.querySelector(".search-history");
  if (old) old.remove();

  inputSearch.parentElement.appendChild(dropdown);
}
