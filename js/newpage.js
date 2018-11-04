const page = document.querySelector('.page-content');
const tech = document.getElementById('tech');
const education = document.getElementById('education');
const hobbies = document.getElementById('my-other-hobbies');

const darken = () => {
  page.classList.toggle('darken');
};

tech.addEventListener('click', (event) => {
  event.preventDefault();
  darken();
  page.style.transition = "1s ease";
  page.style.transform = "translate(-30vw, 0)";
});

education.addEventListener('click', (event) => {
  event.preventDefault();
  darken();
  page.style.transition = "1s ease";
  page.style.transform = "translate(-30vw, -30vh)";
});

hobbies.addEventListener('click', (event) => {
  event.preventDefault();
  darken();
  page.style.transition = "1s ease";
  page.style.transform = "translate(0, -30vh)";
});
