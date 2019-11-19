'use strict';
// gallery.js — модуль, который работает с галереей изображений; Использует вспомогательные модули:
(function () {

  window.gallery = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13
  };

  var closeBigPictureButton = window.preview.bigPicture.querySelector('.big-picture__cancel');
  var photosContainer = document.querySelector('.pictures');

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
    if (evt.keyCode === window.gallery.ESC_KEYCODE) {
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
      if (evt.keyCode === window.gallery.ENTER_KEYCODE) {
        var target = evt.target;
        var photoId = parseInt(target.id, 10);

        addPhotoHandle(photosArray, photoId);
      }
    };

    photosContainer.addEventListener('click', photoClickHandler);
    photosContainer.addEventListener('keydown', photoEnterHandler);
  };


  // Запрос данных с сервера
  var successHandler = function (photosArray) {
    window.drawPhotos(photosArray);
    markPhotos();
    addBigPhotoHandlers(photosArray);
  };

  var getErrorMessage = function () {
    var template = document.querySelector('#error').content.querySelector('.error');
    var element = template.cloneNode(true);

    var fragment = document.createDocumentFragment();
    fragment.appendChild(element);

    return fragment;
  };

  var errorHandler = function (error) {
    var main = document.querySelector('main');
    main.appendChild(getErrorMessage());

    var errorWrapper = document.querySelector('.error__inner');
    var message = document.createElement('p');
    message.textContent = error;
    errorWrapper.appendChild(message);
  };

  window.backend.load(successHandler, errorHandler);
})();
