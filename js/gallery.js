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

  var addPhotoHandle = function (photoId) {
    if (photoId || photoId === 0) {
      window.preview.drawBigPicture(photoId);

      closeBigPictureButton.addEventListener('click', bigPictureCloseHandler);
      document.addEventListener('keydown', bigPictureEscHandler);
    }
  };

  var photoClickHandler = function (evt) {
    var target = evt.target;
    var photoId = parseInt(target.parentElement.id, 10);

    addPhotoHandle(photoId);
  };

  var photoEnterHandler = function (evt) {
    if (evt.keyCode === window.gallery.ENTER_KEYCODE) {
      var target = evt.target;
      var photoId = parseInt(target.id, 10);

      addPhotoHandle(photoId);
    }
  };

  photosContainer.addEventListener('click', photoClickHandler);
  photosContainer.addEventListener('keydown', photoEnterHandler);

  window.drawPhotos();
  markPhotos();
})();
