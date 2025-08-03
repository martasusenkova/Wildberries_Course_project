export function ProductCard() {
  console.log("Карточка товара");
}
export const product = {
  name: "Кроссовки",
  image:
    "https://lauf.shoes/upload/iblock/c17/a6kiw1p2xiq4twmfr3wsropsq0v6z8oj/1Y8A2145_web.jpg",
  initailPrice: 200,
  finalPrice: 150,
  description: "Удобные стильные кроссовки",
};

const { name, image, initailPrice, finalPrice, description } = product;

export function createCard(products) {
  const container = document.createElement("div");
  container.classList.add("productContainer");
  const app = document.getElementById("app");
  console.log(app);
  app.appendChild(container);
  const count = 20;
  if (!container) return console.warn("Контейнер для карточек не найден");
  for (let i = 0; i < count; i++) {
    products.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `<img src= ${image} class ="card__image"/> <p class="card__sale"> -10% </p> 
<div class="card__price"> <p class="card__finalPrice">${finalPrice}</p> <p class="card__initailPrice">${initailPrice}</p> </div> <p class="card__name">${name}</p>`;
      const cardButton = document.createElement("button");
      cardButton.classList.add("card__button");
      card.appendChild(cardButton);
      cardButton.addEventListener("click", () => changeText(cardButton));
      function changeText(card__button) {
      cardButton.textContent = "В корзине!";
      cardButton.classList.add("card__button-two");
      }
      const cardShowButton = document.createElement("button");
      cardShowButton.classList.add("card__show-button");
      card.appendChild(cardShowButton);
      cardShowButton.innerText = "Быстрый просмотр";
      cardButton.innerHTML =
        '<svg class="card__icon" width="17" height="16" fill="#A73AFD" xmlns="http://www.w3.org/2000/svg"> <path class="card__icon-path" d="M2.925.488a.833.833 0 0 0-1.517.691l4.295 9.416v.001c.005.008.023.05.046.09a.9.9 0 0 0 .979.446c.045-.01.089-.023.098-.026l6.22-1.853.105-.031c.44-.13.867-.256 1.201-.523.29-.232.517-.535.657-.88.16-.396.159-.842.158-1.3V4.105c0-.01 0-.06-.004-.11a.901.901 0 0 0-.488-.73.9.9 0 0 0-.447-.098H4.147L2.925.487ZM11.833 12a1.333 1.333 0 0 0 0 2.667h.007a1.333 1.333 0 0 0 0-2.667h-.007ZM3.167 13.334c0-.737.597-1.334 1.333-1.334h.007a1.333 1.333 0 0 1 0 2.667H4.5a1.333 1.333 0 0 1-1.333-1.333Z" fill="#A73AFD"/></svg> <p>Корзина</p>';
      container.appendChild(card);
    });
  }
}
