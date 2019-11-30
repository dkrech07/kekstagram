'use strict';
// filter.js — модуль, который выполняет фильтрацию изображений;
(function () {
  var PHOTOS_NUMBER = 10;

  var imageFilters = document.querySelector('.img-filters');
  var popularButton = imageFilters.querySelector('#filter-popular');
  var randomButton = imageFilters.querySelector('#filter-random');
  var discussedButton = imageFilters.querySelector('#filter-discussed');
  var popular = false;
  var random = false;
  var discussed = false;
  var lastTimeout = null;

  var filteringImages = function () {
    imageFilters.classList.remove('img-filters--inactive');
  };

  var getRandomPhotosArray = function (photosArray) {
    var compareRandom = function () {
      return Math.random() - 0.5;
    };

    return photosArray.sort(compareRandom);
  };

  var getDecreasingPhotosArray = function (photosArray) {

    var compareRandom = function (a, b) {
      return b.comments.length - a.comments.length;
    };

    return photosArray.sort(compareRandom);
  };

  var removePhotos = function () {
    var photos = document.querySelectorAll('.picture');
    for (var i = 0; i < photos.length; i++) {
      photos[i].remove();
    }
  };

  var updatePhotos = function (photosArray) {

    var filteredPhotos = photosArray;

    if (popular) {
      removePhotos();
      window.gallery.drawFilteredPhotos(filteredPhotos);
    }

    if (random) {
      filteredPhotos = getRandomPhotosArray(Array.from(photosArray));
      filteredPhotos.length = PHOTOS_NUMBER;

      removePhotos();
      window.gallery.drawFilteredPhotos(filteredPhotos);
    }

    if (discussed) {
      filteredPhotos = getDecreasingPhotosArray(Array.from(photosArray));

      removePhotos();
      window.gallery.drawFilteredPhotos(filteredPhotos);
    }
  };

  var filterClickHandler = function (evt) {
    popular = false;
    random = false;
    discussed = false;

    var activeButton = imageFilters.querySelector('.img-filters__button--active');
    activeButton.classList.remove('img-filters__button--active');
    evt.target.classList.add('img-filters__button--active');

    if (evt.target.id === 'filter-popular') {
      popular = true;
    }

    if (evt.target.id === 'filter-random') {
      random = true;
    }

    if (evt.target.id === 'filter-discussed') {
      discussed = true;
    }

    // window.debounce(window.backend.load(updatePhotos, window.gallery.errorLoadHandler));

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(function () {
      window.backend.load(updatePhotos, window.gallery.errorLoadHandler);
    }, 2000);
  };

  popularButton.addEventListener('click', filterClickHandler);
  randomButton.addEventListener('click', filterClickHandler);
  discussedButton.addEventListener('click', filterClickHandler);

  filteringImages();
})();
