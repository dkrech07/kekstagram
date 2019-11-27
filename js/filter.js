'use strict';
// filter.js — модуль, который выполняет фильтрацию изображений;
(function () {
  var imageFilters = document.querySelector('.img-filters');
  var popularButton = imageFilters.querySelector('#filter-popular');
  var randomButton = imageFilters.querySelector('#filter-random');
  var discussedButton = imageFilters.querySelector('#filter-discussed');

  var getRandomPhotosArray = function (photosArray) {
    var compareRandom = function () {
      return Math.random() - 0.5;
    };

    return photosArray.sort(compareRandom);
  };

  var removePhotos = function () {
    var photos = document.querySelectorAll('.picture');
    for (var i = 0; i < photos.length; i++) {
      photos[i].remove();
    }
  };

  window.updatePhotos = function (photosArray) {
    // Фильтрация изображений;
    var filteringImages = function () {
      imageFilters.classList.remove('img-filters--inactive');
    };

    var filterClickHandler = function (evt) {
      var filteredPhotos = photosArray;
      var activeButton = imageFilters.querySelector('.img-filters__button--active');
      var target = evt.target;
      var filter = evt.target.id;
      activeButton.classList.remove('img-filters__button--active');

      target.classList.add('img-filters__button--active');

      if (filter === 'filter-random') {
        filteredPhotos = getRandomPhotosArray(Array.from(photosArray));
        filteredPhotos.length = 10;
        console.log(filteredPhotos);
        removePhotos();
        return filteredPhotos;
      }

      window.gallery.successLoadHandler(filteredPhotos);
      removePhotos();
      window.backend.load(window.gallery.successLoadHandler, window.gallery.errorLoadHandler);

      console.log(filteredPhotos);
      // return filteredPhotos;
    };

    popularButton.addEventListener('click', filterClickHandler);
    randomButton.addEventListener('click', filterClickHandler);
    discussedButton.addEventListener('click', filterClickHandler);

    filteringImages();
    console.log(photosArray);
    return photosArray;
  };

})();
