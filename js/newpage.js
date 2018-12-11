const page = document.querySelector('.page-content');
const tech = document.getElementById('tech');
const education = document.getElementById('education');
const hobbies = document.getElementById('my-other-hobbies');
const cross = document.getElementById('close');
const underConstruction = document.getElementById('under-construction');

const darken = () => {
  page.classList.add('darken');
};

const toggleDarken = () => {
  page.classList.toggle('darken');
};

const revert = () => {
  if (page.classList.contains("tech-translate")) {
    page.classList.remove('tech-translate')
  } else if (page.classList.contains("education-translate")) {
    page.classList.remove('education-translate')
  } else if (page.classList.contains("hobbies-translate")) {
    page.classList.remove('hobbies-translate')
  }
}

cross.addEventListener('click', (event) => {
  toggleDarken()
  cross.style.display = "none";
  revert()
  if (underConstruction.classList.contains('under-construction-display')) {
    underConstruction.classList.toggle('under-construction-display')
  }
});
