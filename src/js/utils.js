export function getCard (id) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards.find(item => item.id === id);
}


const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.classList.add("scrollToTopBtn");
app.appendChild(scrollToTopBtn);

// Когда пользователь прокручивает вниз 50px от верха страницы, показываем кнопку
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

// Когда пользователь нажимает на кнопку, прокручиваем страницу вверх
scrollToTopBtn.onclick = function() {
  document.body.scrollTop = 0; // Для Safari
  document.documentElement.scrollTop = 0; // Для Chrome, Firefox, IE и Opera
}