import { OpenModalWindow } from "./ProductCardModal.js";
export function ProductCard() {
  console.log("Карточка товара");
  const container = document.createElement("div")
  container.classList.add("productContainer")
  const app = document.getElementById("app")
  console.log(app);
  app.appendChild(container);
  const card = document.createElement("div")
  card.classList.add("card");
  container.appendChild(card);
  const cardShowButton = document.createElement("button")
  cardShowButton.classList.add("card__show-button")
  card.appendChild(cardShowButton)
  cardShowButton.innerText = 'Быстрый просмотр';
  cardShowButton.onclick = function () {
      openModalWindow("");
  }
}
