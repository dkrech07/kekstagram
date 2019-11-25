'use strict';
// filter.js — модуль, который выполняет фильтрацию изображений;
(function () {
  var imageFilters = document.querySelector('.img-filters');
  var popularButton = imageFilters.querySelector('#filter-popular');
  var randomButton = imageFilters.querySelector('#filter-random');
  var discussedButton = imageFilters.querySelector('#filter-discussed');

  window.updatePhotos = function (photosArray) {
    // Фильтрация изображений;
    var filteringImages = function () {
      imageFilters.classList.remove('img-filters--inactive');
    };

    var filterClickHandler = function (evt) {
      var activeButton = imageFilters.querySelector('.img-filters__button--active');
      var target = evt.target;
      var filter = evt.target.id;
      activeButton.classList.remove('img-filters__button--active');

      target.classList.add('img-filters__button--active');
      var filteredPhotos = photosArray;

      if (filter === 'filter-random') {
        filteredPhotos = photosArray.filter(function (it) {
          return it;
        });
        console.log(filteredPhotos);
        console.log(Math.floor(Math.random(10) * 10));
      }

    };

    popularButton.addEventListener('click', filterClickHandler);
    randomButton.addEventListener('click', filterClickHandler);
    discussedButton.addEventListener('click', filterClickHandler);

    filteringImages();
  };

})();
