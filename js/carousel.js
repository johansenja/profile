const innerWrappers = document.querySelectorAll('.inner-wrapper');
const html = '<i class="fas fa-expand-arrows-alt"></i>';
const carousel = document.getElementById('my-photos');
const allCards = document.querySelectorAll('.card');
const cardsContainer = document.querySelector('.cards');

innerWrappers.forEach((wrapper) => {
  wrapper.innerHTML = html;
  wrapper.firstChild.classList.add('fullscreen');
});

const fullsized = () => {
  innerWrappers.forEach((wrapper) => {
    wrapper.classList.toggle('full-size');
  });
  allCards.forEach((card) => {
    card.classList.toggle('nocards');
  });
  cardsContainer.classList.toggle("nogrid");
};

const fullscreens = document.querySelectorAll('.fullscreen');
fullscreens.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    fullsized();
    document.addEventListener("keyup", (event) => {
      if (event.key === "Escape" && cardsContainer.classList.contains('nogrid')) {
        fullsized();
      }
    });
  })
});
