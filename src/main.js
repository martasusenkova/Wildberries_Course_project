import { ProductCard } from "./components/ProductCard.js";
import { createHeader, createTabBar } from "./components/Header.js";

export const app = document.getElementById('app')
const header = createHeader();
const tabBar = createTabBar();
app.append(header);
app.append(tabBar);

ProductCard();