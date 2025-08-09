import { getProductCards } from "./js/api.js";
import { createHeader, createTabBar } from "./components/Header.js";
import { createSlider } from "./components/Slider.js";
import { getOrCreateContainer, createCard } from "./components/ProductCard.js";
import "./styles/style.scss";
import "./styles/slider.scss";
import "./components/Slider.js";
import { searchProducts } from "./js/search.js";
import { setupHomeClick } from "./components/HomeClick.js";
import { toast } from "./components/toast.js";

export const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const { header, logo, wrapper, searchWrapper, inputSearch } = createHeader();
  const { tabBar, btnBasketTab, btnHome } = createTabBar();
  const slider = createSlider();
  app.append(header, tabBar, slider, toast);
  const container = getOrCreateContainer();
  const card = createCard(getProductCards(), container);
  searchProducts(inputSearch, slider, container, searchWrapper);
  setupHomeClick(logo, slider, inputSearch, container, btnHome);
});
