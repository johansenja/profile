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

tech.addEventListener('click', (event) => {
  event.preventDefault();
  cross.style.display = "block";
  underConstruction.classList.toggle('under-construction-display')
  darken();
  // underConstruction.style.ditogglesplay = "block"
  underConstruction.style.top = "50%"
  underConstruction.style.right = "15%"
  page.classList.toggle('tech-translate');
});

education.addEventListener('click', (event) => {
  event.preventDefault();
  cross.style.display = "block";
  underConstruction.classList.toggle('under-construction-display')
  darken();
  // underConstruction.style.display = "block"
  underConstruction.style.bottom = "-15%"
  underConstruction.style.right = "15%"
  page.classList.toggle('education-translate');
});

hobbies.addEventListener('click', (event) => {
  event.preventDefault();
  cross.style.display = "block";
  underConstruction.classList.toggle('under-construction-display')
  darken();
  // underConstruction.style.display = "block"
  underConstruction.style.bottom = "-30%"
  underConstruction.style.left = "50%"
  page.classList.toggle('hobbies-translate');
});
