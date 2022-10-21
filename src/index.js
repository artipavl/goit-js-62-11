import Pixabay from './js/pixabay';
import crdHbs from './js/card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    Notify.failure('Заповніть поле пошуку!');
    return;
  }
  searchQueryValue = searchQuery;
  gallery.innerHTML = '';
  PixabayP.resetPages();
  insertHTMLinGallery(searchQueryValue);
}

async function insertHTMLinGallery(searchQueryValue) {
  try {
    await PixabayP.getToServer(searchQueryValue).then(resolve => {
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
    });
  } catch (e) {
    console.log(e.name + ': ' + e.message);
    Notify.failure(e.message);
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
