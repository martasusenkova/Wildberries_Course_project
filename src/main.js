import "./styles/style.css";
import "./styles/slider.scss";
import "./components/Slider.js";
import { createSlider } from "./components/Slider.js";

const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const slider = createSlider();
  app.appendChild(slider);
});
