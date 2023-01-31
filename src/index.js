import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import listCountryTpl from './templates/list.hbs';
import cardCountryTpl from './templates/card.hbs';
const DEBOUNCE_DELAY = 300;
const refs = {
  inputSearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.inputSearch.addEventListener(
  'input',
  debounce(onInputSearch, DEBOUNCE_DELAY)
);

const searchError = () => {
  Notiflix.Notify.failure('Oops, there is no country with that name');
};
const tooManyResults = () => {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
};
const clearScreen = () => {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
};

function renderCounrty(data) {
  const countryCard = cardCountryTpl({
    name: data.name,
    capital: data.capital,
    population: data.population,
    languages: data.languages.map(lang => lang.name).join(', '),
    flag: data.flags.svg,
  });
  refs.countryInfo.innerHTML = countryCard;
}

function renderList(data) {
  const list = data
    .map(item => {
      return listCountryTpl({ flag: item.flags.svg, name: item.name });
    })
    .join('');
  refs.countryList.innerHTML = list;
}

function onInputSearch(evt) {
  const value = evt.target.value.trim();

  if (!value) {
    return;
  }
  clearScreen();

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        tooManyResults();
      } else if (data.length > 1) {
        renderList(data);
      } else {
        renderCounrty(data[0]);
      }
    })
    .catch(() => searchError());
}
