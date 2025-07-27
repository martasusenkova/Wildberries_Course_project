import { ProductCard } from "./components/ProductCard.js";
import { header, tabBar, Header } from "./components/Header.js";
import "./styles/style.css";

const root = document.getElementById('app');
root.append(header);
root.append(tabBar);


ProductCard();
Header();
