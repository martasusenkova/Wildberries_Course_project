export function getCard (id) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards.find(item => item.id === id);
}
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function throttle(fn, ms) {
  let last = 0;
  let t;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    } else {
      clearTimeout(t);
      t = setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, ms - (now - last));
    }
  };
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