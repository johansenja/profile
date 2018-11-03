// const viewer = document.querySelector('.parallax');
// const wrapper = document.querySelector('.parallax-wrapper');
// const image1 = wrapper.firstChild.nextSibling;

// const start = () => {
//   image1.classList.add('parallax-active');
// };

// image1.addEventListener('load', (event) => {
//   start();
// });

// const swipe = () => {
//   const active = document.querySelector('.parallax-active');
//   if (active.nextElementSibling) {
//   active.nextElementSibling.classList.add('parallax-active');
//   active.classList.remove('parallax-active');
//   } else {
//     start();
//   }
// };

// const addSecondary = () => {
//   wrapper.addEventListener(('scroll'), (event) => {swipe()});
// };

// viewer.addEventListener(('mouseover'), (event) => {addSecondary()});
// viewer.addEventListener(('mouseleave'), (event) => {
//   wrapper.removeEventListener('scroll', addSecondary());
// });

// document.getElementById('main-carousel').carousel({
//   interval: 1000
// });
