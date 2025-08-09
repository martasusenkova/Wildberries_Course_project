import { createCard } from "../components/ProductCard";
import { getProductCards } from "../js/api";

let lastQuery = "";
const MAX_HISTORY = 5;
const SEARCH_HISTORY_KEY = "searchHistory";

export function getLastQuery() {
  return lastQuery;
}

export function setLastQuery(value) {
  lastQuery = value;
}

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

// Поиск
export function handleSearch(query, container, emptyMessage, inputSearch) {
  lastQuery = query;

  const products = getProductCards();
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  console.log("Searching for:", query, "Found:", filtered.length);

  container.innerHTML = "";
  container.classList.add("container__margin");

  if (emptyMessage) emptyMessage.remove();

  if (filtered.length === 0) {
    const containerEmptyWrapper = document.createElement("div");
    containerEmptyWrapper.classList.add("containerEmptyWrapper");

    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("emptyMessageWrapper");

    messageWrapper.style.padding = "20px 0 0 16px";

    const message = document.createElement("p");
    message.classList.add("emptyMessage");
    message.style.fontWeight = "700";
    message.textContent = `Ничего не нашлось по запросу «${inputSearch.value}»`;

    const subMessage = document.createElement("p");
    subMessage.classList.add("emptyMessage-sub");
    subMessage.textContent =
      "Попробуйте поискать по-другому или сократить запрос";
    subMessage.style.fontWeight = "400";
    subMessage.style.lineHeight = "22px";
    subMessage.style.opacity = "0.7";

    messageWrapper.appendChild(message);
    messageWrapper.appendChild(subMessage);
    containerEmptyWrapper.appendChild(messageWrapper);
    container.appendChild(containerEmptyWrapper);

    return message;
  }

  createCard(filtered, container);
  return null;
}

// Поиск товаров
export function searchProducts(inputSearch, slider, container, searchWrapper) {
  let emptyMessage = null;

  // Поиск по Enter
  inputSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const query = inputSearch.value.trim();
      if (!query) return;

      slider.style.display = "none";
      container.innerHTML = ""; // очистить контейнер

      // Меняем иконку на крестик
      searchWrapper.classList.add("is-searching");

      // Удаляем предыдущий прогресс-бар, если есть
      const oldLoader = container.querySelector(".loader");
      if (oldLoader) oldLoader.remove();

      const svgNS = "http://www.w3.org/2000/svg";

      const loader = document.createElementNS(svgNS, "svg");
      loader.setAttribute("class", "loader");
      loader.setAttribute("width", "64");
      loader.setAttribute("height", "64");
      loader.setAttribute("viewBox", "0 0 66 66");
      loader.style.position = "absolute";
      loader.style.top = "40%";
      loader.style.left = "50%";

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("class", "path");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke-width", "6");
      circle.setAttribute("stroke-linecap", "round");
      circle.setAttribute("stroke-dasharray", "187");
      circle.setAttribute("cx", "33");
      circle.setAttribute("cy", "33");
      circle.setAttribute("r", "29");

      loader.appendChild(circle);
      container.appendChild(loader);

      setTimeout(() => {
        loader.remove();

        const currentEmptyMessage = container.querySelector(".emptyMessage");
        emptyMessage =
          handleSearch(query, container, currentEmptyMessage, inputSearch) ||
          null;

        saveQueryToHistory(query);
      }, 2000);
    }
  });

  // Показ истории при вводе
  inputSearch.addEventListener("input", () => {
    showSearchHistory(inputSearch);
  });

  // Показ истории при фокусе
  inputSearch.addEventListener("focus", () => {
    showSearchHistory(inputSearch);
  });

  // Удаление списка истории
  inputSearch.addEventListener("blur", () => {
    setTimeout(() => {
      const old = document.querySelector(".search-history");
      if (old) old.remove();
    }, 200);
  });

  searchWrapper.addEventListener("click", (e) => {
    // проверяем, что клик именно по псевдоэлементу ::after (крестику)
    if (searchWrapper.classList.contains("is-searching")) {
      searchInput.value = "";
      searchWrapper.classList.remove("is-searching");
      searchInput.focus();
    }
  });
}
