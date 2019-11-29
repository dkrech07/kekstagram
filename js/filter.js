'use strict';
// filter.js — модуль, который выполняет фильтрацию изображений;
(function () {
  var PHOTOS_NUMBER = 10;

  var imageFilters = document.querySelector('.img-filters');
  var popularButton = imageFilters.querySelector('#filter-popular');
  var randomButton = imageFilters.querySelector('#filter-random');
  var discussedButton = imageFilters.querySelector('#filter-discussed');

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
    photosArray.sort(function(a, b) {
      return b.comments.length - a.comments.length;
    });

    return photosArray;
  };

  var removePhotos = function () {
    var photos = document.querySelectorAll('.picture');
    for (var i = 0; i < photos.length; i++) {
      photos[i].remove();
    }
  };

  window.updatePhotos = function (photosArray) {
    var filterClickHandler = function (evt) {
      var filteredPhotos = photosArray;
      var activeButton = imageFilters.querySelector('.img-filters__button--active');
      activeButton.classList.remove('img-filters__button--active');

      if (evt.target.id === 'filter-popular') {
        removePhotos();
        window.gallery.drawFilteredPhotos(filteredPhotos);

        console.log('filter-popular');
        console.log(filteredPhotos);
      }

      if (evt.target.id === 'filter-random') {
        filteredPhotos = getRandomPhotosArray(Array.from(photosArray));
        filteredPhotos.length = PHOTOS_NUMBER;

        removePhotos();
        window.gallery.drawFilteredPhotos(filteredPhotos);

        console.log('filter-random');
        console.log(filteredPhotos);
      }

      if (evt.target.id === 'filter-discussed') {
        filteredPhotos = Array.from(photosArray);

        removePhotos();
        window.gallery.drawFilteredPhotos(getDecreasingPhotosArray(filteredPhotos));

        console.log('filter-discussed');
        console.log(filteredPhotos);
      }

      evt.target.classList.add('img-filters__button--active');
    };

    popularButton.addEventListener('click', filterClickHandler);
    randomButton.addEventListener('click', filterClickHandler);
    discussedButton.addEventListener('click', filterClickHandler);
  };

  filteringImages();
})();
