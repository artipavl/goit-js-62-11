const API = 'https://pixabay.com/api/';
const API_KEY = '30745008-d5532b40a5a7d9416df3fd4b0';

export default class Pixabay {
  constructor() {
    this.page = 1;
    this.pageItems = 0;
  }

  async getToServer(name) {
    const firstPageJsonP = fetch(
      `${API}?key=${API_KEY}&q=${name}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page="20"&page=${this.page}`
    ).then(resolve => resolve.json());
    const secondPageJsonP = fetch(
      `${API}?key=${API_KEY}&q=${name}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page="20"&page=${
        this.page + 1
      }`
    ).then(resolve => resolve.json());

    const serverResponse = await Promise.all([firstPageJsonP, secondPageJsonP]);
    const fatchServerResponse = serverResponse[0];
    fatchServerResponse.hits.push(...serverResponse[1].hits);

    this.upPages();
    if (fatchServerResponse.totalHits === 0) {
      throw Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    // console.log(fatchServerResponse.hits.length)
    this.pageItems += Number(fatchServerResponse.hits.length);
    return fatchServerResponse;
  }

  resetPages() {
    this.page = 1;
  }

  upPages() {
    this.page += 2;
  }

  resetPageItems() {
    this.pageItems = 0;
  }
}
