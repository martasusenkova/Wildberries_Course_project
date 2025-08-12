import { createCard } from "../components/ProductCard";
import { getProductCards } from "../js/api";

let lastQuery = "";

export function getLastQuery() {
  return lastQuery;
}

export function setLastQuery(value) {
  lastQuery = value;
}
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
      "Попробуйте поискать по‑другому или сократить запрос";
    subMessage.style.fontWeight = "400";
    subMessage.style.lineHeight = "22px";
    subMessage.style.opacity = "0.7";

    message.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    containerEmptyWrapper.append(messageWrapper);
    messageWrapper.appendChild(message);
    messageWrapper.appendChild(subMessage);
    container.appendChild(containerEmptyWrapper);

    return message;
  }

  createCard(filtered, container);
  return null;
}

export function searchProducts(inputSearch, slider, container) {
  let emptyMessage = null;
  inputSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const query = inputSearch.value.trim();

      //  Если поле пустое — ничего не делаем, оставляем старый результат
      if (query === "") {
        console.log("Пустой запрос — оставляем предыдущий результат");
        return;
      }

      slider.style.display = "none";

      const currentEmptyMessage = container.querySelector(".emptyMessage");

      emptyMessage =
        handleSearch(query, container, currentEmptyMessage, inputSearch) ||
        null;

      // saveQueryToHistory(query);
    }
  });
}
