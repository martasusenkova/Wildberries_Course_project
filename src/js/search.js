import { createCard } from "../components/ProductCard";
import { getProductCards } from "../js/api";
// import { sliderWrapper } from "../components/Slider.js";

let lastQuery = "";

export function getLastQuery() {
  return lastQuery;
}

export function setLastQuery(value) {
  lastQuery = value;
}

export function searchProducts(inputSearch, slider) {
  inputSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const query = inputSearch.value.trim();
      slider.style.display = "none";
      if (query === "" || query === lastQuery) return;
      lastQuery = query;

      const products = getProductCards(); // все товары из localStorage

      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );

      // Удаляем старые карточки
      const oldContainer = document.querySelector(".productContainer");
      if (oldContainer) {
        oldContainer.remove();
      }

      // Удаляем сообщение "Товары не найдены", если оно есть
      const emptyMessage = document.querySelector(".emptyMessage");
      if (emptyMessage) {
        emptyMessage.remove();
      }

      if (filtered.length > 0) {
        createCard(filtered); // создаём карточки
      } else {
        const message = document.createElement("p");
        message.textContent = "Товары не найдены";
        message.classList.add("emptyMessage");
        message.style.padding = "20px";
        document.querySelector("#app").appendChild(message);
      }
    }
  });
}
