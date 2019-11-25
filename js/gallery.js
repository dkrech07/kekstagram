'use strict';
// gallery.js — модуль, который работает с галереей изображений; Использует вспомогательные модули:
(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var closeBigPictureButton = window.preview.bigPicture.querySelector('.big-picture__cancel');
  var photosContainer = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');
  var popularButton = imageFilters.querySelector('#filter-popular');
  var randomButton = imageFilters.querySelector('#filter-random');
  var discussedButton = imageFilters.querySelector('#filter-discussed');

  var markPhotos = function () {
    var allPhotos = photosContainer.querySelectorAll('.picture');
    for (var i = 0; i < allPhotos.length; i++) {
      allPhotos[i].id = i;
    }
  };

  var removeBigPictureListeners = function () {
    closeBigPictureButton.removeEventListener('click', bigPictureCloseHandler);
    document.removeEventListener('keydown', bigPictureEscHandler);
  };

  var bigPictureCloseHandler = function () {
    window.preview.bigPicture.classList.add('hidden');
    removeBigPictureListeners();
  };

  var bigPictureEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      bigPictureCloseHandler();
    }
  };

  var addPhotoHandle = function (photosArray, photoId) {
    if (photoId || photoId === 0) {
      window.preview.drawBigPicture(photosArray, photoId);

      closeBigPictureButton.addEventListener('click', bigPictureCloseHandler);
      document.addEventListener('keydown', bigPictureEscHandler);
    }
  };

  var addBigPhotoHandlers = function (photosArray) {

    var photoClickHandler = function (evt) {
      var target = evt.target;
      var photoId = parseInt(target.parentElement.id, 10);

      addPhotoHandle(photosArray, photoId);
    };

    var photoEnterHandler = function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        var target = evt.target;
        var photoId = parseInt(target.id, 10);

        addPhotoHandle(photosArray, photoId);
      }
    };

    photosContainer.addEventListener('click', photoClickHandler);
    photosContainer.addEventListener('keydown', photoEnterHandler);
  };

  // Фильтрация изображений;
  var filteringImages = function () {
    imageFilters.classList.remove('img-filters--inactive');
  };

  var filterClickHandler =  function (evt) {
    // var activeButtons = imageFilters.querySelectorAll('.img-filters__button');
    //
    // console.log(activeButtons);
    //
    // for (var i = 0; i < activeButtons.legnth; i++) {
    //   activeButtons.classList.remove('.img-filters__button--active');
    // }

    var target = evt.target;
    target.classList.add('img-filters__button--active');
    console.log(target);
  };

  popularButton.addEventListener('click', filterClickHandler);
  randomButton.addEventListener('click', filterClickHandler);
  discussedButton.addEventListener('click', filterClickHandler);

  // Запрос данных с сервера;
  var successLoadHandler = function (photosArray) {
    window.drawPhotos(photosArray);
    markPhotos();
    addBigPhotoHandlers(photosArray);
    filteringImages();
  };

  // Обработчики закрытия сообщения об ошибке загрузке / отправке данных;
  var addErrorMessageHandlers = function () {
    var errorMessage = document.querySelector('.error');
    var errorButton = errorMessage.querySelector('.error__button');

    var errorMessageClickHandler = function () {
      errorMessage.remove();
      removeErrorButtonHandlers();
    };

    var messageButtonEscHandler = function (evt) {
      if (evt.keyCode === window.gallery.ESC_KEYCODE) {
        errorMessageClickHandler();
      }
    };

    var windowClickHandler = function (evt) {
      if (evt.target.className === 'error') {
        errorMessageClickHandler();
      }
    };

    errorButton.addEventListener('click', errorMessageClickHandler);
    document.addEventListener('keydown', messageButtonEscHandler);
    document.addEventListener('click', windowClickHandler);

    var removeErrorButtonHandlers = function () {
      errorButton.removeEventListener('click', errorMessageClickHandler);
      document.removeEventListener('keydown', messageButtonEscHandler);
      document.removeEventListener('click', windowClickHandler);
    };
  };

  // Сообщение об ошибке при загрузке данных с сервера;
  var getErrorMessage = function () {
    var template = document.querySelector('#error').content.querySelector('.error');
    var element = template.cloneNode(true);

    var fragment = document.createDocumentFragment();
    fragment.appendChild(element);

    return fragment;
  };

  // Кастомизация сообщения об ошибке;
  var errorLoadHandler = function (error) {
    var main = document.querySelector('main');
    main.appendChild(getErrorMessage());

    var errorWrapper = document.querySelector('.error__inner');
    var message = document.createElement('p');
    message.textContent = error;
    errorWrapper.appendChild(message);

    addErrorMessageHandlers();
  };

  window.backend.load(successLoadHandler, errorLoadHandler);

  window.gallery = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    errorLoadHandler: errorLoadHandler
  };
})();
