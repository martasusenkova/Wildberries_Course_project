import { app } from "../main.js";


export const toast = document.createElement('p');
toast.classList.add('toast'); 
toast.textContent = 'Товар добавлен в корзину';

 
//document.getElementsByClassName('card__button').addEventListener("click", () => showToast());