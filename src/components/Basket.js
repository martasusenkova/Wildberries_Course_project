// components/Basket.js
import "../styles/basket.scss";
import { app } from "../main";
import { getCard } from "../js/utils";
import {
  editProdInbasket,
  deleteProdInbasket,
  countProdInBasket,
} from "../js/localStorage";
import { changeTextInRedCircle } from "./Header";

export let countProducts = countProdInBasket();
let initialPrice = 0;
let finalPrice = 0;

const basket = document.createElement("div");
basket.classList.add("basket");
basket.id = "basket";

// вспомогательная функция: закрытие корзины + переход на главную при необходимости
function goHomeIfNeeded() {
  basket.classList.add("non-active");
  document.body.style.overflow = "";

  // Если слайдер не виден, значит корзина открыта не с главной → переходим
  const sliderVisible =
    document.querySelector(".slider")?.style.display !== "none";
  if (!sliderVisible) {
    document.dispatchEvent(
      new CustomEvent("go:home", { detail: { force: true } })
    );
  }

  document.dispatchEvent(
    new CustomEvent("cart:change", { detail: { id: null, inCart: false } })
  );
}

// функция открытия корзины
export function openBasket() {
  const stored = localStorage.getItem("basket");
  if (!stored || JSON.parse(stored).length === 0) createEmptyBasket();
  else createFillBasket();
}

/* -------------------- createEmptyBasket -------------------- */
function createEmptyBasket() {
  document.body.style.overflow = "hidden";
  basket.classList.remove("non-active");

  const emptyBasket = document.createElement("div");
  emptyBasket.classList.add("basket__container_empty", "basket");
  emptyBasket.setAttribute("height", "300px");

  const emptyBasketImage = document.createElement("img");
  emptyBasketImage.src = "src/assets/basket/cart.webp";
  emptyBasketImage.classList.add("basket__image");

  const emptyBasketTitle = document.createElement("p");
  emptyBasketTitle.classList.add("basket__title");
  emptyBasketTitle.textContent = "В корзине пока пусто";

  const emptyBasketSubtitle = document.createElement("p");
  emptyBasketSubtitle.classList.add("basket__subtitle");
  emptyBasketSubtitle.textContent =
    "Загляните на главную — собрали там товары, которые могут вам понравиться";

  const emptyBasketHome = document.createElement("button");
  emptyBasketHome.classList.add("basket__btn-home");
  emptyBasketHome.textContent = "Перейти на главную";

  emptyBasket.append(
    emptyBasketImage,
    emptyBasketTitle,
    emptyBasketSubtitle,
    emptyBasketHome
  );

  const overlay = document.createElement("div");
  overlay.classList.add("basket__overlay");
  overlay.append(emptyBasket);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      basket.classList.add("non-active");
      document.body.style.overflow = "";
      overlay.remove();
    }
  });

  emptyBasketHome.addEventListener("click", () => {
    emptyBasket.parentElement.remove();
    goHomeIfNeeded();
  });

  basket.append(overlay);
  app.append(basket);
}

/* -------------------- вспомогалки -------------------- */
function isBasketEmpty() {
  const el = document.getElementById("fillBasket");
  if (countProducts == 0) {
    if (el) el.remove();
    createEmptyBasket();
  }
}

function changingCountProduct() {
  const bs = document.getElementById("basketSubtitle");
  if (bs) bs.textContent = `${countProducts} товаров`;
  const cot = document.getElementById("countOfProductsText");
  if (cot) cot.textContent = `Товары, ${countProducts} шт.`;
}

function changingPrices() {
  const tp = document.getElementById("totalPriceNum");
  if (tp) tp.textContent = `${finalPrice} р.`;
  const con = document.getElementById("countOfProductsNum");
  if (con) con.textContent = `${initialPrice} р.`;
  const md = document.getElementById("myDiscontNum");
  if (md) md.textContent = `${finalPrice - initialPrice} р.`;
}

/* -------------------- createCard (строка в корзине) -------------------- */
function createCard(id, num) {
  let count = num;
  countProducts += num;

  const card = document.createElement("div");
  card.classList.add("basket__card");

  const item = getCard(id);

  // карточка
  const cardInfo = document.createElement("div");
  cardInfo.classList.add("cardInfo");

  const cardImg = document.createElement("img");
  cardImg.classList.add("cardImg");
  cardImg.src = item.image;

  const cardDesc = document.createElement("div");
  cardDesc.classList.add("basket__cardDesc");

  // цены
  const itemFinalPrice = parseInt(item.finalPrice);
  const itemInitialPrice = parseInt(item.price);
  initialPrice += itemInitialPrice * num;
  finalPrice += itemFinalPrice * num;

  const pricePhone = document.createElement("div");
  pricePhone.classList.add("basket__price-div", "basket__price-div_phone");

  const finalPricePhone = document.createElement("span");
  finalPricePhone.classList.add("basket__card__finalPrice");
  finalPricePhone.textContent = `${itemFinalPrice * count} р.`;

  const initialPricePhone = document.createElement("span");
  initialPricePhone.classList.add("basket__card__initailPrice");
  initialPricePhone.textContent = `${itemInitialPrice * count} р.`;

  pricePhone.append(finalPricePhone, initialPricePhone);
  cardDesc.append(pricePhone);

  // заголовок
  const itemTitleProd = document.createElement("div");
  itemTitleProd.classList.add("basket__itemTitleProd");

  const itemTitle = document.createElement("span");
  itemTitle.textContent = item.name;

  const itemSlash = document.createElement("span");
  itemSlash.textContent = ", ";

  const itemProd = document.createElement("span");
  itemProd.textContent = item.brand;

  itemTitleProd.append(itemTitle, itemSlash, itemProd);
  cardDesc.append(itemTitleProd);

  // доставка
  const itemDelivery = document.createElement("span");
  itemDelivery.textContent = "доставка будет в ближайшее время";
  itemDelivery.classList.add("basket__itemDelivery");
  cardDesc.append(itemDelivery);

  // иконки пк (удаление)
  const cardIconsLaptop = document.createElement("div");
  cardIconsLaptop.classList.add("basket__cardIcons");

  const cardFavoriteLaptop = document.createElement("button");
  cardFavoriteLaptop.classList.add("basket__cardFavoriteLaptop", "non-active");
  cardFavoriteLaptop.setAttribute("data-id", item.id);

  const cardDeleteLaptop = document.createElement("button");
  cardDeleteLaptop.classList.add("basket__cardDeleteLaptop");
  cardDeleteLaptop.setAttribute("data-id", item.id);

  cardDeleteLaptop.addEventListener("click", (event) => {
    countProducts -= count;
    initialPrice -= itemInitialPrice * count;
    finalPrice -= itemFinalPrice * count;
    const id = event.currentTarget.dataset.id;
    deleteProdInbasket(id);
    changeTextInRedCircle();
    changingPrices();
    changingCountProduct();
    isBasketEmpty();
    card.remove();

    document.dispatchEvent(
      new CustomEvent("cart:change", { detail: { id, inCart: false } })
    );
  });

  cardIconsLaptop.append(cardFavoriteLaptop, cardDeleteLaptop);
  cardDesc.append(cardIconsLaptop);

  cardInfo.append(cardImg, cardDesc);

  // счетчик
  const cardCountIcons = document.createElement("div");
  cardCountIcons.classList.add("basket__cardCountIcons");

  const cardCount = document.createElement("div");
  cardCount.classList.add("cardCount");

  const btnMinus = document.createElement("button");
  if (count === 1) btnMinus.setAttribute("disabled", "");
  btnMinus.textContent = "-";
  btnMinus.classList.add("btn__count");
  btnMinus.setAttribute("data-id", item.id);

  const countNum = document.createElement("p");
  countNum.textContent = `${count}`;

  const btnPlus = document.createElement("button");
  btnPlus.textContent = "+";
  btnPlus.classList.add("btn__count");
  btnPlus.setAttribute("data-id", item.id);

  btnMinus.addEventListener("click", (event) => {
    count--;
    countProducts--;
    const id = event.currentTarget.dataset.id;
    editProdInbasket(id, -1);
    changingCountProduct();
    changeTextInRedCircle();
    if (count === 1) btnMinus.setAttribute("disabled", "");
    countNum.textContent = `${count}`;
    finalPricePhone.textContent = `${itemFinalPrice * count} р.`;
    initialPricePhone.textContent = `${itemInitialPrice * count} р.`;
    finalPriceLaptop.textContent = `${itemFinalPrice * count} р.`;
    initialPriceLaptop.textContent = `${itemInitialPrice * count} р.`;
    finalPrice -= itemFinalPrice;
    initialPrice -= itemInitialPrice;
    changingPrices();
    if (count < 99) btnPlus.removeAttribute("disabled");
  });

  btnPlus.addEventListener("click", (event) => {
    btnMinus.removeAttribute("disabled");
    count++;
    countProducts++;
    const id = event.currentTarget.dataset.id;
    editProdInbasket(id, 1);
    changingCountProduct();
    countNum.textContent = `${count}`;
    finalPricePhone.textContent = `${itemFinalPrice * count} р.`;
    initialPricePhone.textContent = `${itemInitialPrice * count} р.`;
    finalPriceLaptop.textContent = `${itemFinalPrice * count} р.`;
    initialPriceLaptop.textContent = `${itemInitialPrice * count} р.`;
    finalPrice += itemFinalPrice;
    initialPrice += itemInitialPrice;
    changingPrices();
    changeTextInRedCircle();
    if (count >= 99) btnPlus.setAttribute("disabled", "");
  });

  cardCount.append(btnMinus, countNum, btnPlus);
  cardCountIcons.append(cardCount);

  const cardIcons = document.createElement("div");
  cardIcons.classList.add("basket__cardIcons");

  const cardFavoritePhone = document.createElement("button");
  cardFavoritePhone.classList.add("basket__cardFavoritePhone");
  cardFavoritePhone.setAttribute("data-id", item.id);

  const cardDeletePhone = document.createElement("button");
  cardDeletePhone.classList.add("basket__cardDeletePhone");
  cardDeletePhone.setAttribute("data-id", item.id);

  cardDeletePhone.addEventListener("click", (event) => {
    countProducts -= count;
    const id = event.currentTarget.dataset.id;
    deleteProdInbasket(id);
    changeTextInRedCircle();
    changingCountProduct();
    changingPrices();
    isBasketEmpty();
    card.remove();

    document.dispatchEvent(
      new CustomEvent("cart:change", { detail: { id, inCart: false } })
    );
  });

  cardIcons.append(cardFavoritePhone, cardDeletePhone);
  cardCountIcons.append(cardIcons);

  // цена для десктопа
  const priceLaptop = document.createElement("div");
  priceLaptop.classList.add("basket__price-div_laptop");

  const finalPriceLaptop = document.createElement("span");
  finalPriceLaptop.classList.add("basket__card__finalPrice");
  finalPriceLaptop.textContent = `${itemFinalPrice * count} р.`;

  const initialPriceLaptop = document.createElement("span");
  initialPriceLaptop.classList.add("basket__card__initailPrice");
  initialPriceLaptop.textContent = `${itemInitialPrice * count} р.`;

  priceLaptop.append(finalPriceLaptop, initialPriceLaptop);

  card.append(cardInfo, cardCountIcons, priceLaptop);
  return card;
}

/* -------------------- createFillBasket -------------------- */
function createFillBasket() {
  countProducts = 0;
  initialPrice = 0;
  finalPrice = 0;

  document.body.style.overflow = "hidden";
  basket.classList.remove("non-active");

  const fillBasket = document.createElement("div");
  fillBasket.classList.add("basket__container_fill");
  fillBasket.id = "fillBasket";

  const fillBasketProducts = document.createElement("div");
  fillBasketProducts.classList.add("basket__field_fill");

  const inBasket = JSON.parse(localStorage.getItem("basket")) || [];
  inBasket.forEach((element) => {
    fillBasketProducts.append(createCard(element.id, element.count));
  });

  // блок с ценами
  const fillBasketPrice = document.createElement("div");
  fillBasketPrice.classList.add("basket__field_fill");

  const countOfProducts = document.createElement("div");
  countOfProducts.classList.add("basket__subtitle_fill", "flex-space-b");
  const countOfProductsText = document.createElement("span");
  countOfProductsText.textContent = `Товары, ${countProducts} шт.`;
  countOfProductsText.id = "countOfProductsText";
  const countOfProductsNum = document.createElement("span");
  countOfProductsNum.textContent = `${initialPrice} р.`;
  countOfProductsNum.id = "countOfProductsNum";
  countOfProducts.append(countOfProductsText, countOfProductsNum);

  const myDiscont = document.createElement("div");
  myDiscont.classList.add("basket__subtitle_fill", "flex-space-b");
  const myDiscontText = document.createElement("span");
  myDiscontText.textContent = `Моя скидка`;
  const myDiscontNum = document.createElement("span");
  myDiscontNum.textContent = `${finalPrice - initialPrice} р.`;
  myDiscontNum.id = "myDiscontNum";
  myDiscont.append(myDiscontText, myDiscontNum);

  const totalPrice = document.createElement("div");
  totalPrice.classList.add("basket__title_fill", "flex-space-b");
  const totalPriceText = document.createElement("span");
  totalPriceText.textContent = `Итого`;
  const totalPriceNum = document.createElement("span");
  totalPriceNum.textContent = `${finalPrice} р.`;
  totalPriceNum.id = "totalPriceNum";
  totalPrice.append(totalPriceText, totalPriceNum);

  const btnOrder = document.createElement("button");
  btnOrder.classList.add("basket__btn-home");
  btnOrder.textContent = "Заказать";

  fillBasketPrice.append(countOfProducts, myDiscont, totalPrice, btnOrder);
  fillBasket.append(fillBasketProducts, fillBasketPrice);

  const basketTitle = document.createElement("p");
  basketTitle.classList.add("basket__title_fill");
  basketTitle.textContent = "Корзина";
  const basketSubtitle = document.createElement("p");
  basketSubtitle.classList.add("basket__subtitle_fill");
  basketSubtitle.textContent = `${countProducts} товаров`;
  basketSubtitle.id = "basketSubtitle";

  fillBasketProducts.prepend(basketSubtitle);
  fillBasketProducts.prepend(basketTitle);

  // Оверлей
  const overlay = document.createElement("div");
  overlay.classList.add("basket__overlay");
  overlay.append(fillBasket);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      basket.classList.add("non-active");
      document.body.style.overflow = "";
      overlay.remove();
    }
  });

  btnOrder.addEventListener("click", () => {
    basket.classList.add("non-active");
    document.body.style.overflow = "";
    overlay.remove();

    localStorage.removeItem("basket");
    changeTextInRedCircle();
    createSuccessfulOrder();
  });

  basket.append(overlay);
  app.append(basket);
}

/* -------------------- createSuccessfulOrder -------------------- */
function createSuccessfulOrder() {
  document.body.style.overflow = "hidden";
  basket.classList.remove("non-active");

  const emptyBasket = document.createElement("div");
  emptyBasket.classList.add("basket__container_empty", "basket");
  emptyBasket.setAttribute("height", "300px");

  const emptyBasketImage = document.createElement("img");
  emptyBasketImage.src = "src/assets/basket/deliveryCar.gif";
  emptyBasketImage.classList.add("basket__image");

  const emptyBasketTitle = document.createElement("p");
  emptyBasketTitle.classList.add("basket__title");
  emptyBasketTitle.textContent =
    "ЗАКАЗ УСПЕШНО ОФОРМЛЕН И БУДЕТ ОТПРАВЛЕН В БЛИЖАЙШЕЕ ВРЕМЯ";

  const emptyBasketSubtitle = document.createElement("p");
  emptyBasketSubtitle.classList.add("basket__subtitle");
  emptyBasketSubtitle.textContent =
    "Загляните на главную — возможно вы захотите заказать что-нибудь еще";

  const emptyBasketHome = document.createElement("button");
  emptyBasketHome.classList.add("basket__btn-home");
  emptyBasketHome.textContent = "Перейти на главную";

  emptyBasket.append(
    emptyBasketImage,
    emptyBasketTitle,
    emptyBasketSubtitle,
    emptyBasketHome
  );

  const overlay = document.createElement("div");
  overlay.classList.add("basket__overlay");
  overlay.append(emptyBasket);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      basket.classList.add("non-active");
      document.body.style.overflow = "";
      overlay.remove();
    }
  });

  emptyBasketHome.addEventListener("click", () => {
    emptyBasket.parentElement.remove();
    goHomeIfNeeded();
  });

  basket.append(overlay);
  app.append(basket);

  document.dispatchEvent(
    new CustomEvent("cart:change", { detail: { id: null, inCart: false } })
  );
}
