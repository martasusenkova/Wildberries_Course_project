import { openModalWindow } from "./ProductCardModal.js";
import { app } from "../main.js";

export function createCard(products) {
  // Создаём один контейнер
  const container = document.createElement("div");
  container.classList.add("productContainer");

  // Если продуктов нет — не продолжаем
  if (!products || products.length === 0) return;

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${product.image}" class="card__image"/>
      <p class="card__sale">-10%</p>
      <div class="card__price">
        <p class="card__finalPrice">${product.finalPrice}</p>
        <p class="card__initailPrice">${product.price}</p>
      </div>
      <p class="card__name">${product.name}</p>
    `;

    const cardButton = document.createElement("button");
    cardButton.classList.add("card__button");
    cardButton.innerHTML = `
      <svg class="card__icon" width="17" height="16" fill="#A73AFD" xmlns="http://www.w3.org/2000/svg">
        <path class="card__icon-path" d="M2.925.488a.833.833 0 0 0-1.517.691l4.295 9.416v.001c.005.008.023.05.046.09a.9.9 0 0 0 .979.446c.045-.01.089-.023.098-.026l6.22-1.853.105-.031c.44-.13.867-.256 1.201-.523.29-.232.517-.535.657-.88.16-.396.159-.842.158-1.3V4.105c0-.01 0-.06-.004-.11a.901.901 0 0 0-.488-.73.9.9 0 0 0-.447-.098H4.147L2.925.487ZM11.833 12a1.333 1.333 0 0 0 0 2.667h.007a1.333 1.333 0 0 0 0-2.667h-.007ZM3.167 13.334c0-.737.597-1.334 1.333-1.334h.007a1.333 1.333 0 0 1 0 2.667H4.5a1.333 1.333 0 0 1-1.333-1.333Z" fill="#A73AFD"/>
      </svg>
      <p>Корзина</p>
    `;

    cardButton.addEventListener("click", () => {
      cardButton.textContent = "В корзине!";
      cardButton.classList.add("card__button-two");
    });

    const cardShowButton = document.createElement("button");
    cardShowButton.classList.add("card__show-button");
    cardShowButton.innerText = "Быстрый просмотр";
    cardShowButton.setAttribute("data-id", product.id);

    card.append(cardButton, cardShowButton);
    container.appendChild(card);
    return { card, cardButton, cardShowButton };
  });

  // Ставим обработчик на весь контейнер (делегирование)
  container.addEventListener("click", (event) => {
    if (event.target.classList.contains("card__show-button")) {
      const cardId = event.target.dataset.id;
      openModalWindow(cardId);
    }
  });

  // Добавляем контейнер с карточками в `app` один раз
  app.appendChild(container);

  return container;
}
