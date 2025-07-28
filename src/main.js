import "./styles/style.css";
import "./styles/slider.scss";
import "./components/Slider.js";
import { createSlider } from "./components/Slider.js";

const app = document.querySelector("#app");

document.addEventListener("DOMContentLoaded", () => {
  const slider = createSlider();
  document.querySelector("#app").appendChild(slider);
});
