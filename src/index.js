import Pixabay from "./js/pixabay";
import crdHbs from "./js/card.hbs";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const PixabayP = new Pixabay();
let searchQueryValue = '';

form.addEventListener('submit', event => {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    console.log('pust');
    return;
    }
    searchQueryValue = searchQuery;
    PixabayP.resetPages();
    PixabayP.getToServer(searchQuery).then(r => {
        gallery.insertAdjacentHTML('beforeend', crdHbs(r))
     });
});

loadMore.addEventListener('click', event => {
    PixabayP.getToServer(searchQueryValue).then(r => {
        gallery.insertAdjacentHTML('beforeend', crdHbs(r))
     });
})