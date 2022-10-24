import axios from 'axios';

const API = 'https://pixabay.com/api/';
const API_KEY = '30745008-d5532b40a5a7d9416df3fd4b0';

export default class Pixabay {
  #pageItems;
  #pageTotal;
  #pageСounter;

  constructor() {
    this.page = 1;
    this.#pageItems = 0;
    this.#pageTotal = 0;
    this.#pageСounter = 0;
  }

  async getToServer(name) {
    const serverResponse = await Promise.all([
      this.axiosGet(name, this.page),
      this.axiosGet(name, this.page + 1),
    ]);

    const fatchServerResponse = serverResponse[0];
    fatchServerResponse.hits.push(...serverResponse[1].hits);

    if (fatchServerResponse.totalHits === 0) {
      throw Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    this.upPages();
    this.calculatePagesTotal(fatchServerResponse);
    this.upPagesСounter();
    this.addpageItems(fatchServerResponse);

    return fatchServerResponse;
  }

  reset() {
    this.page = 1;
    this.#pageItems = 0;
    this.#pageСounter = 0;
    this.#pageTotal = 0;
  }

  upPages() {
    this.page += 2;
  }
  upPagesСounter() {
    this.#pageСounter += 1;
  }
  calculatePagesTotal(response) {
    this.#pageTotal = Math.ceil(response.totalHits / 40);
  }

  addpageItems(response) {
    this.#pageItems += Number(response.hits.length);
  }

  async axiosGet(name, page) {
    const response = await axios.get(
      `${API}?key=${API_KEY}&q=${name}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page="20"&page=${page}`
    );
    return response.data;
  }

  get pageItems() {
    return this.#pageItems;
  }

  get pageTotal() {
    return this.#pageTotal;
  }

  get pageСounter() {
    return this.#pageСounter;
  }
}
