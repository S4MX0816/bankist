'use strict';

///////////////////////////////////////
// Elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnNavLinks = document.querySelector('.nav__links');
const allSections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');
const containerTabs = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const sectionTabs = document.querySelectorAll('.operations__content');
const navBar = document.querySelector('.nav');
const header = document.querySelector('.header');
const lazyImgs = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Window Scrolling

btnNavLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // const s1Coord = section1.getBoundingClientRect();
  // console.log(s1Coord);
  // window.scrollTo({
  //   left: s1Coord.left + window.pageXOffset,
  //   top: s1Coord.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Tabbing

containerTabs.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.btn');
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  sectionTabs.forEach(s => s.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu hover

function eventHandler(e) {
  const opacity = this;
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (s) {
      if (s !== link) {
        s.style.opacity = opacity;
      }
    });

    logo.style.opacity = opacity;
  }
}

navBar.addEventListener('mouseover', eventHandler.bind(0.5));
navBar.addEventListener('mouseout', eventHandler.bind(1));

///////////////////////////////////////
// Sticky Navigation Bar

// const initCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initCoords.top) {
//     navBar.classList.add('sticky');
//   } else navBar.classList.remove('sticky');
// });

const obsCallBack = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navBar.classList.add('sticky');
  else navBar.classList.remove('sticky');
};

const navHeight = navBar.getBoundingClientRect().height;

const obsOptions = {
  root: null,
  threshold: [0],
  rootMargin: `-${navHeight}px`,
};

const observer = new IntersectionObserver(obsCallBack, obsOptions);
observer.observe(header);

///////////////////////////////////////
// Reveal section bars

const sectObsCallBack = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const sectObsOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  sectObsCallBack,
  sectObsOptions
);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy images loading

const loadImgs = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  loadImagesObersver.unobserve(entry.target);
};

const loadImgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '+200px',
};

const loadImagesObersver = new IntersectionObserver(loadImgs, loadImgOptions);

lazyImgs.forEach(li => loadImagesObersver.observe(li));

///////////////////////////////////////
// Slider

const sliderFunction = function () {
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  const gotoSlide = function (sl) {
    slides.forEach(function (slide, i) {
      slide.style.transform = `translateX(${(i - sl) * 100}%)`;
    });
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      const html = `
    <button class="dots__dot" data-slide="${i}"></button>`;

      dotsContainer.insertAdjacentHTML('beforeend', html);
    });
  };

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      currentSlide = e.target.dataset.slide;
      gotoSlide(currentSlide);
      activateDots(currentSlide);
    }
  });

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide) currentSlide = 0;
    else currentSlide++;
    gotoSlide(currentSlide);
    activateDots(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide;
    else currentSlide--;
    gotoSlide(currentSlide);
    activateDots(currentSlide);
  };

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
    activateDots(currentSlide);
  });

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  const init = function () {
    createDots();
    activateDots(0);
    gotoSlide(0);
  };

  init();
};

sliderFunction();

///////////////////////////////////////
// Closing tab

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});

///////////////////////////////////////
///////////////////////////////////////

/*
console.log(document.getElementsByTagName('button'));
console.log(document.getElementsByClassName('btn'));
*/

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML = `We use cookies for improved functionality and analytics. <button class='btn btn--close--cookie'>Got it!</button>`;
// // document.querySelector('header').prepend(message);
// // document.querySelector('header').append(message.cloneNode(true));
// document.querySelector('header').append(message);
// // document.querySelector('header').before(message);
// // document.querySelector('header').after(message);

// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', () => message.remove());

// message.style.backgroundColor = '#37383d';
// message.style.width = '104.5%';
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');
