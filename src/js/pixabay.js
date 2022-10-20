export default class Pixabay {
  #API = 'https://pixabay.com/api/';
  #API_KEY = '30745008-d5532b40a5a7d9416df3fd4b0';

  constructor() {
    // this.API = 'https://pixabay.com/api/';
    // this.API_KEY = '30745008-d5532b40a5a7d9416df3fd4b0';
    this.page = 1;
  }

  async getToServer(name) {
    const firstPageJson = await fetch(
      `${this.#API}?key=${
        this.#API_KEY
      }&q=${name}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page="20"&page=${
        this.page
      }`
    );
    const secondPageJson = await fetch(
      `${this.#API}?key=${
        this.#API_KEY
      }&q=${name}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page="20"&page=${
        this.page + 1
      }`
    );
    const firstPage = await firstPageJson.json();
    const secondPage = await secondPageJson.json();
    const fatchCoop = firstPage;
    fatchCoop.hits.push(...secondPage.hits);
    this.upPages();
    return fatchCoop;
  }

  resetPages() {
    this.page = 1;
  }

  upPages() {
    this.page += 2;
  }
}
