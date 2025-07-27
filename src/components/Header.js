export function Header() {
  console.log("header");
}

export const header = document.createElement('header');
const logo = document.createElement('a');
logo.classList.add('logoHeader')
const inputSearch = document.createElement('input');
inputSearch.classList.add('searchInput');
inputSearch.placeholder = 'Найти на Wildberries';
const btnBasket = document.createElement('button');
btnBasket.classList.add('btnBasket');
btnBasket.innerHTML = 'Корзина';

header.append(logo);
header.append(inputSearch);
header.append(btnBasket);

export const tabBar = document.createElement('div');
tabBar.classList.add('tabBar');
const btnHome = document.createElement('button');
btnHome.classList.add('tabBar__home');
const btnBasketTab = document.createElement('button');
btnBasketTab.classList.add('tabBar__basket');

tabBar.append(btnHome);
tabBar.append(btnBasketTab);