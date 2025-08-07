import { app } from "../main.js";

export const toast = document.createElement('p');
toast.classList.add('toast'); 
toast.textContent = 'Товар добавлен в корзину';

    export function showToast() {
      toast.classList.add("toast_show");
      // Скрываем через 3 секунды
      setTimeout(() => {
        toast.classList.remove("toast_show");
      }, 5000);
    }
 
