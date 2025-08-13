import { getProductCards } from "../js/api.js";
import { createCard } from "./ProductCard.js";
import { setLastQuery } from "../js/search.js";

export function setupHomeClick(
  logo,
  slider,
  inputSearch,
  container,
  btnHome,
  searchWrapper,
  fileInput
) {
  // утилита: мы на экране поиска?
  const isInSearch = () => {
    const hasClass = !!(
      searchWrapper && searchWrapper.classList.contains("is-searching")
    );
    const hasQuery = !!(inputSearch && inputSearch.value.trim().length);
    return hasClass || hasQuery;
  };

  // отрисовка главной
  const renderHome = () => {
    slider.style.display = "block";
    if (inputSearch) inputSearch.value = "";
    if (typeof setLastQuery === "function") setLastQuery("");

    if (container) {
      container.innerHTML = "";
      const emptyMessage = container.querySelector(".emptyMessage");
      if (emptyMessage) emptyMessage.remove();

      const products = getProductCards();
      createCard(products, container);
    }

    if (searchWrapper) searchWrapper.classList.remove("is-searching");
    if (fileInput) fileInput.classList.remove("input-disabled");
  };

  // переход на главную — только если мы действительно в поиске
  const goHomeIfSearching = () => {
    if (!isInSearch()) return; // уже на главной — ничего не делаем
    renderHome();
  };

  logo.addEventListener("click", goHomeIfSearching);
  btnHome.addEventListener("click", goHomeIfSearching);
}
