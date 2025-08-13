import { createHeader, createTabBar } from "./components/Header.js";
import { createSlider } from "./components/Slider.js";
import { initProductsInfinite } from "./components/ProductCard.js";
import "./styles/style.scss";
import "./styles/slider.scss";
import "./components/Slider.js";
import { searchProducts } from "./js/search.js";
import { setupHomeClick } from "./components/HomeClick.js";
import { toast } from "./components/toast.js";

export const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", async () => {
  const { header, logo, wrapper, searchWrapper, inputSearch, fileInput } =
    createHeader();
  const { tabBar, btnBasketTab, btnHome } = createTabBar();
  const slider = createSlider();
  app.append(header, tabBar, slider, toast);
  
try {
const container = initProductsInfinite();
searchProducts(inputSearch, slider, container, searchWrapper, fileInput);
  setupHomeClick(
    logo,
    slider,
    inputSearch,
    container,
    btnHome,
    searchWrapper,
    fileInput
  );
} catch (e) {
console.error('Ошибка инициализации контейнера:', e);
}
});

