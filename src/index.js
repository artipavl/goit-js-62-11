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

form.addEventListener('submit', event => {
  event.preventDefault();

  addIsHidden(loadMore);

  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    console.log('pust');
    return;
  }
  searchQueryValue = searchQuery;
  gallery.innerHTML = '';
  PixabayP.resetPages();
  PixabayP.getToServer(searchQuery).then(r => {
    if (r.totalHits === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.info(
        `Hooray! We found ${r.totalHits} images.`
    );
    
    insertHTMLinGallery(r);
  });
});

function insertHTMLinGallery(r) {
      if (r.hits.length < 40) {
      gallery.insertAdjacentHTML('beforeend', crdHbs(r));
        lightbox.refresh();
    }else if (r.hits.length >= 40) {
      gallery.insertAdjacentHTML('beforeend', crdHbs(r));
      removeIsHidden(loadMore);
        lightbox.refresh();
    }
}

loadMore.addEventListener('click', event => {
  removeIsHidden(loadMore);
  PixabayP.getToServer(searchQueryValue).then(r => {
    if (r.hits.length < 40) {
      gallery.insertAdjacentHTML('beforeend', crdHbs(r));
        lightbox.refresh();
      return;
    }
    if (r.hits.length >= 40) {
      gallery.insertAdjacentHTML('beforeend', crdHbs(r));
      removeIsHidden(loadMore);
        lightbox.refresh();
    }
  });
});

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