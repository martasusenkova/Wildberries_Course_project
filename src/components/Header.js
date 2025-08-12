import { openBasket, countProducts } from "./Basket";
import { countProdInBasket } from "../js/localStorage";

let count = countProducts;
// создание header
export function createHeader() {
  const header = document.createElement("header");
  const wrapper = document.createElement("div");
  wrapper.classList.add("header__wrapper");

  const logo = document.createElement("a");
  logo.classList.add("header__logo");
  logo.href = "#app";

  const searchWrapper = document.createElement("div");
  searchWrapper.classList.add("header__searchWrapper");

  const inputSearch = document.createElement("input");
  inputSearch.classList.add("header__searchInput");
  inputSearch.placeholder = "Найти на Wildberries";

  // Кнопка-иконка (label для file input)
  const label = document.createElement("label");
  label.classList.add("header__searchLabel");
  label.setAttribute("for", "uploadPhoto");

  // Скрытый file input
  const fileInput = document.createElement("input");
  fileInput.classList.add("header__photo-searchInput");

  fileInput.type = "file";
  fileInput.id = "uploadPhoto";
  fileInput.accept = "image/*";
  fileInput.capture = "environment";

  // При выборе файла — выводим в консоль (или запускаем поиск по фото)
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      console.log("Загружен файл:", file);
    }
  });

  const btnBasket = document.createElement("button");
  btnBasket.classList.add("header__btnBasket");
  btnBasket.innerHTML = "Корзина";
  btnBasket.onclick = () => {
    openBasket();
  }

  const countProds = document.createElement('div');
  countProds.classList.add('header__red-circle');
  countProds.id = 'countProdsH';
  if (count < 100)
    countProds.textContent = countProducts;
  else
    countProds.textContent = '99+';
  if (count == 0) {
    countProds.classList.add('non-active');
  } else {
    countProds.classList.remove('non-active');
  }
  btnBasket.append(countProds);
  

  searchWrapper.append(inputSearch, label, fileInput);
  wrapper.append(logo, searchWrapper, btnBasket);
  header.append(wrapper);

  return { header, wrapper, logo, searchWrapper, inputSearch, fileInput };
}

//создание tabBar
export function createTabBar() {
  const tabBar = document.createElement("div");
  tabBar.classList.add("tabBar");

  const btnHome = document.createElement("a");
  btnHome.classList.add("tabBar__home");
  btnHome.href = "#app";

  const btnBasketTab = document.createElement("button");
  btnBasketTab.classList.add("tabBar__basket");
  btnBasketTab.onclick = () => {
    openBasket();
  }
  const countProds = document.createElement('div');
  countProds.classList.add('tabBar__red-circle');
  countProds.id = 'countProdsTB';
  if (count < 100)
    countProds.textContent = countProducts;
  else
    countProds.textContent = '99+';
  if (count == 0) {
    countProds.classList.add('non-active');
  } else {
    countProds.classList.remove('non-active');
  }
  btnBasketTab.append(countProds);

  tabBar.append(btnHome);
  tabBar.append(btnBasketTab);
  return { tabBar, btnBasketTab, btnHome };
}

export function changeTextInRedCircle() {
  let count = countProdInBasket();
  if (count < 100) {
    document.getElementById('countProdsH').textContent = count;
    document.getElementById('countProdsTB').textContent = count;
  } else {
    document.getElementById('countProdsH').textContent = '99+';
    document.getElementById('countProdsTB').textContent = '99+';
  }

  if (count == 0) {
    document.getElementById('countProdsH').classList.add('non-active');
    document.getElementById('countProdsTB').classList.add('non-active');
  } else {
    document.getElementById('countProdsH').classList.remove('non-active');
    document.getElementById('countProdsTB').classList.remove('non-active');
  }
}