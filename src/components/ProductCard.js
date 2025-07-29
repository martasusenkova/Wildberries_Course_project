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
<div class="card__price"><p class="card__initailPrice">${initailPrice}</p> <p class="card__finalPrice">${finalPrice}</p> </div> <p class="card__name">${name}</p>`;
      const cardButton = document.createElement("button");
      cardButton.classList.add("card__button");
      card.appendChild(cardButton);
      const cardShowButton = document.createElement("button");
      cardShowButton.classList.add("card__show-button");
      card.appendChild(cardShowButton);
      cardShowButton.innerText = "Быстрый просмотр";
      cardButton.innerHTML =
        '<svg enable-background="new 0 0 64 64" height="64px" id="Layer_1" version="1.1" viewBox="0 0 64 64" width="64px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M23.734,28.125c1.104,0,2-0.896,2-2v-7.8c0-3.487,2.837-6.325,6.324-6.325c3.487,0,6.325,2.838,6.325,6.325v7.8   c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2v-7.8C42.384,12.632,37.752,8,32.058,8c-5.692,0-10.324,4.632-10.324,10.325v7.8   C21.734,27.229,22.63,28.125,23.734,28.125z"/><path d="M55,23.631H44.384v2.494c0,2.206-1.794,4-4,4s-4-1.794-4-4v-2.494h-8.649v2.494c0,2.206-1.794,4-4,4s-4-1.794-4-4v-2.494H9   c-0.552,0-0.893,0.435-0.762,0.971l6.998,28.497C15.658,54.701,17.344,56,19,56h26c1.658,0,3.342-1.299,3.766-2.901l6.996-28.497   C55.893,24.065,55.553,23.631,55,23.631z"/></g></svg> <p>Корзина</p>';
      container.appendChild(card);
    });
  }
}
