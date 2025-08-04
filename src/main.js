import { createHeader, createTabBar } from "./components/Header.js";
import { createSlider } from "./components/Slider.js";
import { createCard, product } from "./components/ProductCard.js";
import "./styles/style.scss";
import "./styles/slider.scss";
import "./components/Slider.js";
export const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const header = createHeader();
  const tabBar = createTabBar();
  const slider = createSlider();
  app.append(header, tabBar, slider);
  createCard([product]);
});
