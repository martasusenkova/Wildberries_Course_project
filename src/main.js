import { getProductCards } from "./js/api.js";
import { createHeader, createTabBar } from "./components/Header.js";
import { createSlider } from "./components/Slider.js";
import { createCard } from "./components/ProductCard.js";
import "./styles/style.scss";
import "./styles/slider.scss";
import "./components/Slider.js";
export const app = document.getElementById("app");
import { toast } from "./components/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = createHeader();
  const tabBar = createTabBar();
  const slider = createSlider();
  app.append(header, tabBar, slider, toast);
  createCard(getProductCards());
  
});