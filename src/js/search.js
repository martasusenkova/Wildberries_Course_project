import {
  createCard,
  state as productState,
} from "../components/ProductCard.js";
import { getProductCards } from "../js/api.js";
import {
  saveQueryToHistory,
  showSearchHistory,
} from "../components/SearchHistory.js";

let lastQuery = "";

export function getLastQuery() {
  return lastQuery;
}

export function setLastQuery(value) {
  lastQuery = value;
}

// ========== Фильтрация и отображение поиска ==========
export async function handleSearch(
  query,
  container,
  emptyMessage,
  inputSearch
) {
  lastQuery = query;

  if (!container) {
    console.error("handleSearch: container не найден");
    return null;
  }

  // Получаем все товары (асинхронно)
  const products = await getProductCards();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  // Очистка контейнера и подготовка к рендеру
  container.innerHTML = "";
  container.classList.add("container__margin");

  if (emptyMessage) emptyMessage.remove();

  if (filtered.length === 0) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("containerEmptyWrapper");

    const msgWrapper = document.createElement("div");
    msgWrapper.classList.add("emptyMessageWrapper");
    msgWrapper.style.padding = "20px 0 0 16px";

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

    msgWrapper.append(message, subMessage);
    wrapper.appendChild(msgWrapper);
    container.appendChild(wrapper);

    return message;
  }

  createCard(filtered, container);
  return null;
}

// ========== Настройка поиска ==========
export function searchProducts(
  inputSearch,
  slider,
  container,
  searchWrapper,
  fileInput
) {
  if (!inputSearch || !container) return;

  let emptyMessage = null;

  inputSearch.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const query = inputSearch.value.trim();
    if (!query) return;

    // Отключаем подгрузку старых карточек
    if (productState && productState.observer) {
      productState.observer.disconnect();
      productState.observer = null;
      productState.done = true;
    }

    // Скрываем слайдер
    if (slider) slider.style.display = "none";

    // Очистка контейнера
    container.innerHTML = "";
    container.classList.add("wide-container");

    if (searchWrapper) searchWrapper.classList.add("is-searching");
    if (fileInput) fileInput.classList.add("input-disabled");

    // Прогресс-бар
    const svgNS = "http://www.w3.org/2000/svg";
    const loader = document.createElementNS(svgNS, "svg");
    loader.setAttribute("class", "loader");
    loader.setAttribute("width", "64");
    loader.setAttribute("height", "64");
    loader.setAttribute("viewBox", "0 0 66 66");
    loader.style.position = "absolute";
    loader.style.top = "35%";
    loader.style.left = "45%";

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

    setTimeout(async () => {
      loader.remove();
      container.classList.remove("wide-container");

      emptyMessage = await handleSearch(
        query,
        container,
        emptyMessage,
        inputSearch
      );
      saveQueryToHistory(query);
    }, 300); // быстрая задержка
  });

  // История поиска
  inputSearch.addEventListener("input", () => showSearchHistory(inputSearch));
  inputSearch.addEventListener("focus", () => showSearchHistory(inputSearch));
  inputSearch.addEventListener("blur", () =>
    setTimeout(() => {
      const old = document.querySelector(".search-history");
      if (old) old.remove();
    }, 200)
  );

  // Кнопка очистки
  if (searchWrapper && !searchWrapper.querySelector(".clear-btn")) {
    const clearBtn = document.createElement("button");
    clearBtn.classList.add("clear-btn");
    clearBtn.setAttribute("aria-label", "Очистить поиск");
    searchWrapper.appendChild(clearBtn);

    clearBtn.addEventListener("click", () => {
      inputSearch.value = "";
      container.innerHTML = "";
      container.classList.remove("wide-container");
      if (fileInput) fileInput.classList.remove("input-disabled");
      searchWrapper.classList.remove("is-searching");
      if (slider) slider.style.display = "block";
      inputSearch.focus();
    });
  }
}
