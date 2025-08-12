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
import { createChatbot, createChatbotToggler } from "./components/ChatBot.js";

export const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const { header, inputSearch, logo } = createHeader();
  const { tabBar, btnBasketTab, btnHome } = createTabBar();
  const slider = createSlider();
  app.append(header, tabBar, slider, toast);

  const container = getOrCreateContainer();
  createCard(getProductCards(), container);
  searchProducts(inputSearch, slider, container);
  setupHomeClick(logo, slider, inputSearch, container, btnHome);

  // Создаём чат-бот и кнопку toggler
  const chatbot = createChatbot(app); // передаём DOM-элемент app
  createChatbotToggler(app, chatbot); // передаём app и объект чат-бота
});
