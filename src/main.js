import { ProductCard } from "./components/ProductCard.js";
import { getProductCards } from "./js/api.js";
import { Header } from "./components/Header.js";
import "./styles/style.scss";
getProductCards ();
ProductCard();
Header();
