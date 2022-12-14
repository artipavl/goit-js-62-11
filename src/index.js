import Pixabay from './js/pixabay';
import crdHbs from './js/card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const throttle = require('lodash.throttle');

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const options = {
  enableKeyboard: true,
};

const lightbox = new SimpleLightbox('.gallery a', options);

const PixabayP = new Pixabay();

let searchQueryValue = '';

form.addEventListener('submit', formSubmit);
loadMore.addEventListener('click', onLoadMoreClick);

function formSubmit(event) {
  event.preventDefault();

  addIsHidden(loadMore);

  searchQueryValue = event.target.elements.searchQuery.value.trim();

  gallery.innerHTML = '';

  if (!searchQueryValue) {
    Notify.failure('Заповніть поле пошуку!');
    return;
  }

  PixabayP.reset();
  insertHTMLinGallery(searchQueryValue);
}

async function insertHTMLinGallery(searchQueryValue) {
  try {
    const PixabaySeach = await PixabayP.getToServer(searchQueryValue);
    return addItemsInGallery(PixabaySeach);
  } catch (e) {
    console.log(e);
    // console.log(e.name + ': ' + e.message);
    Notify.failure(e.message);
  }
}

function addItemsInGallery(resolve) {
  // для одноразового виводу повідомлення
  if (PixabayP.pageСounter === 1) {
    Notify.info(`Hooray! We found ${resolve.totalHits} images.`);
  }

  gallery.insertAdjacentHTML('beforeend', crdHbs(resolve));
  lightbox.refresh();

  //старий варіант

  // if (resolve.hits.length < 40) {
  //   addIsHidden(loadMore);               // забу це додати в минулий раз
  // }

  // if (resolve.hits.length >= 40) {
  //   removeIsHidden(loadMore);

  //   // //для скроллу 2
  //   // const cardEl = document.querySelector('.photo-card:nth-last-child(15)');
  //   // observer.observe(cardEl);
  // }

  // після рекомендацій ментора
  // if (PixabayP.pageItems%40) {
  //   addIsHidden(loadMore);
  // } else {
  //   removeIsHidden(loadMore);

  //   // // для скроллу 2
  //   // const cardEl = document.querySelector('.photo-card:nth-last-child(15)');
  //   // observer.observe(cardEl);
  // }

  //порівняно з попередніми працює якщо повернеться totalHits=40,80,160...
  if (PixabayP.pageTotal === PixabayP.pageСounter) {
    addIsHidden(loadMore);
  }
  if (PixabayP.pageTotal > PixabayP.pageСounter) {
    removeIsHidden(loadMore);

    // // для скроллу 2
    // const cardEl = document.querySelector('.photo-card:nth-last-child(15)');
    // observer.observe(cardEl);
  }
}

function onLoadMoreClick() {
  removeIsHidden(loadMore);
  insertHTMLinGallery(searchQueryValue);
}

function removeIsHidden(elments) {
  elments.classList.remove('is-hidden');
}

function addIsHidden(elments) {
  elments.classList.add('is-hidden');
}

gallery.addEventListener('click', openLightBox);

function openLightBox(event) {
  lightbox.overlay = true;
}

// скрол ----------------

// window.addEventListener('scroll', throttle(scrollDocument, 1000));

// function scrollDocument() {
//   const rectBottom = document.documentElement.getBoundingClientRect().bottom;
//   if (PixabayP.pageItems % 40 === 0 && rectBottom < 2000) {
//     insertHTMLinGallery(searchQueryValue);
//   } else {
//     return;
//   }
// }

//для скроллу 2
const scrollOptions = {
  // threshold: 1,
};

// масив для зберігання елементів на яких спрацьовує тригер
const elArrTriger = [];

const observer = new IntersectionObserver(observerTriger, scrollOptions);

function observerTriger(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (elArrTriger.indexOf(entry.target) < 0) {
        insertHTMLinGallery(searchQueryValue);
        elArrTriger.push(entry.target);
      }
    }
  });
}
