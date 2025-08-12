export function getCard (id) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards.find(item => item.id === id);
}

const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.classList.add("scrollToTopBtn");
app.appendChild(scrollToTopBtn);

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

scrollToTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};