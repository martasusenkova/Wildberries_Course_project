import {
  initProductsInfinite,
  destroyProductsInfinite,
} from "./ProductCard.js";
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
  async function goHomeIfSearching() {
    // если НЕ в поиске — ничего не делаем
    if (!searchWrapper?.classList.contains("is-searching")) return;

    // UI: сразу переключаем видимость слайдера и очищаем поле поиска
    if (slider) slider.style.display = "block";
    if (inputSearch) inputSearch.value = "";
    if (typeof setLastQuery === "function") setLastQuery("");

    // Отключаем старый инфинити и очищаем контейнер
    try {
      destroyProductsInfinite();
    } catch (err) {
      console.warn("destroyProductsInfinite failed:", err);
    }

    if (container) {
      container.innerHTML = "";
    }

    // Сбрасываем стили поиска
    searchWrapper?.classList.remove("is-searching");
    fileInput?.classList.remove("input-disabled");

    // Перезапускаем инфинити (ВЫЗЫВАЕМ БЕЗ АРГУМЕНТОВ, если у initProductsInfinite нет параметров)
    try {
      await initProductsInfinite(); // <- если у тебя сигнатура без аргументов
      // либо, если у тебя initProductsInfinite принимает id: await initProductsInfinite(container?.id);
    } catch (err) {
      console.error("Ошибка при инициализации продуктов:", err);
    }

    // опционально — прокрутка вверх
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  logo.addEventListener("click", goHomeIfSearching);
  btnHome.addEventListener("click", goHomeIfSearching);
}
