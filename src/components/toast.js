import { app } from "../main.js";

export const toast = document.createElement('p');
toast.classList.add('toast'); 
toast.textContent = 'Товар добавлен в корзину';

    export function showToast() {
      toast.classList.add("toast_show");
      // Скрываем через 5 секунд
      setTimeout(() => {
        toast.classList.remove("toast_show");
      }, 5000);
    }
 
//document.getElementsByClassName('card__button').addEventListener("click", () => showToast());