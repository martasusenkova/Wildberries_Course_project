import { getProductCards } from "./js/api.js";
import { createHeader, createTabBar } from "./components/Header.js";
import { createSlider } from "./components/Slider.js";
import { getOrCreateContainer, createCard } from "./components/ProductCard.js";
import "./styles/style.scss";
import "./styles/slider.scss";
import "./components/Slider.js";
import { handleSearch, searchProducts } from "./js/search.js";
import { setupLogoClick } from "./components/Logo.js";
export const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const { header, inputSearch, logo } = createHeader();
  const tabBar = createTabBar();
  const slider = createSlider();
  app.append(header, tabBar, slider);
  const container = getOrCreateContainer();
  const card = createCard(getProductCards(), container);
  searchProducts(inputSearch, slider, container);
  setupLogoClick(logo, slider, inputSearch, container);
});
