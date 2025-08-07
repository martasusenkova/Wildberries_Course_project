import { getProductCards } from "../js/api.js";
import { createCard } from "../components/ProductCard.js";
import { setLastQuery } from "../js/search.js";

export function setupLogoClick(logo, slider, inputSearch, container) {
  logo.addEventListener("click", () => {
    slider.style.display = "block";
    inputSearch.value = "";
    setLastQuery("");

    container.innerHTML = ""; // очищаем перед рендером

    const emptyMessage = container.querySelector(".emptyMessage");
    if (emptyMessage) emptyMessage.remove();

    const products = getProductCards();
    createCard(products, container);
  });
}
