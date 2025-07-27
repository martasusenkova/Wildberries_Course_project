import { ProductCard } from "./components/ProductCard.js";
import { Header } from "./components/Header.js";
import "./styles/style.css";
import "./styles/slider.scss";
import "./components/Slider.js";
import { createSlider } from "./components/Slider.js";

const app = document.querySelector("#app");
app.appendChild(createSlider());
ProductCard();
Header();
