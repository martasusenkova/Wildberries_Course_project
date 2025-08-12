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
  function goHome() {
    slider.style.display = "block";
    inputSearch.value = "";
    setLastQuery("");

    container.innerHTML = ""; // очищаем перед рендером

    const emptyMessage = container.querySelector(".emptyMessage");
    if (emptyMessage) emptyMessage.remove();

    searchWrapper.classList.remove("is-searching");
    fileInput.classList.remove("input-disabled"); // возвращаем приём фото

    const products = getProductCards();
    createCard(products, container);
  }

  logo.addEventListener("click", goHome);
  btnHome.addEventListener("click", goHome);
}
