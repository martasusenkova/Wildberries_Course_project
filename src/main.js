import { ProductCard } from "./components/ProductCard.js";
import { createHeader, createTabBar } from "./components/Header.js";

export const root = document.getElementById('app')
createHeader();
createTabBar();

ProductCard();
Header();
