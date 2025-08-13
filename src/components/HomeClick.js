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
  // утилита: проверяем — в поиске ли мы (состояние поиска)
  const isInSearch = () => {
    const hasClass = !!(
      searchWrapper && searchWrapper.classList.contains("is-searching")
    );
    const hasQuery = !!(inputSearch && inputSearch.value.trim().length);
    return hasClass || hasQuery;
  };

  async function renderHome() {
    if (slider) slider.style.display = "block";
    if (inputSearch) inputSearch.value = "";
    if (typeof setLastQuery === "function") setLastQuery("");

    // Отключаем старый инфинити и очищаем контейнер
    try {
      destroyProductsInfinite();
    } catch (e) {}

    if (container) {
      container.innerHTML = "";
    }

    if (searchWrapper) searchWrapper.classList.remove("is-searching");
    if (fileInput) fileInput.classList.remove("input-disabled");

    try {
      await initProductsInfinite();
    } catch (err) {
      console.error(
        "Ошибка перезапуска инфинити при переходе на главную:",
        err
      );
    }

    // опционально прокрутка вверх
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // С существующим поведением — только если реально в поиске
  const goHomeIfSearching = () => {
    if (!isInSearch()) return;
    renderHome();
  };

  logo.addEventListener("click", goHomeIfSearching);
  btnHome.addEventListener("click", goHomeIfSearching);

  // Глобальный слушатель: если кто-то явно просит перейти на главную — делаем это.
  document.addEventListener("go:home", (e) => {
    const force = !!(e.detail && e.detail.force);
    // Если force=true — переходим всегда; иначе — только если в поиске
    if (force || isInSearch()) {
      renderHome();
    }
  });
}
