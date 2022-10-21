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

  PixabayP.resetPages();
  insertHTMLinGallery(searchQueryValue);
}

async function insertHTMLinGallery(searchQueryValue) {
  try {
    const PixabaySeach = await PixabayP.getToServer(searchQueryValue);
    return addItemsInGallery(PixabaySeach);
  } catch (e) {
    // console.log(e);
    // console.log(e.name + ': ' + e.message);
    Notify.failure(e.message);
  }
}

function addItemsInGallery(resolve) {
  if (PixabayP.page === 3) {
    Notify.info(`Hooray! We found ${resolve.totalHits} images.`);
  }
  if (resolve.hits.length < 40) {
    gallery.insertAdjacentHTML('beforeend', crdHbs(resolve));
    lightbox.refresh();
  } else if (resolve.hits.length >= 40) {
    gallery.insertAdjacentHTML('beforeend', crdHbs(resolve));
    removeIsHidden(loadMore);
    lightbox.refresh();
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

window.addEventListener('scroll', throttle(scrollDocument,1000));


 function scrollDocument() {
 const rectBottom = document.documentElement.getBoundingClientRect().bottom;
  // console.log(rectBottom);
  if (rectBottom < 2000) {
    // console.log('dobavil')
    insertHTMLinGallery(searchQueryValue);
  }
}