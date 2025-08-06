import { getProductCards } from "../js/api.js";
import { createCard } from "../components/ProductCard.js";
import { setLastQuery } from "../js/search.js";

export function setupLogoClick(logo, slider, inputSearch, container) {
  logo.addEventListener("click", () => {
    // 1. Показать слайдер
    slider.style.display = "block";

    // 2. Очистить строку поиска
    inputSearch.value = "";
    setLastQuery("");
    // 3. Удалить старые карточки
    const oldContainer = document.querySelector(".productContainer");
    if (oldContainer) oldContainer.innerHTML = "";

    // 4. Удалить сообщение "Товары не найдены"
    const emptyMessage = document.querySelector(".emptyMessage");

    if (emptyMessage) emptyMessage.remove();

    // 5. Получить все товары и отрендерить заново
    const products = getProductCards();
    createCard(products);
  });
}
