import { ProductCard } from "./components/ProductCard.js";
import { createHeader, createTabBar } from "./components/Header.js";

export const root = document.getElementById('app')
const header = createHeader();
const tabBar = createTabBar();
root.append(header);
root.append(tabBar);

ProductCard();