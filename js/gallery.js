'use strict';
// gallery.js — модуль, который работает с галереей изображений; Использует вспомогательные модули:
(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEFAULT_COMMENTS_NUMBER = 5;

  var closeBigPictureButton = window.preview.bigPicture.querySelector('.big-picture__cancel');
  var photosContainer = document.querySelector('.pictures');
  var loadButton = window.preview.bigPicture.querySelector('.social__comments-loader');

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

      var commentsNumber = photosArray[photoId].comments.length;
      var commentsList = Array.from(photosArray[photoId].comments);

      window.preview.drawBigPicture(photosArray, photoId);

      if (commentsNumber > DEFAULT_COMMENTS_NUMBER) {
        loadButton.classList.remove('visually-hidden');
        commentsList.length = commentsList.length - (commentsList.length - DEFAULT_COMMENTS_NUMBER);
        window.preview.drawCommentInformation(commentsList);
      } else {
        window.preview.drawCommentInformation(commentsList);
      }

      var photoDisplayStep = DEFAULT_COMMENTS_NUMBER;
      var loadButtonClickHandler = function (evt) {
        evt.preventDefault();
        var newCommentsList = Array.from(photosArray[photoId].comments);
        photoDisplayStep += 5;
        newCommentsList.length = commentsList.length - (commentsList.length - photoDisplayStep);

        if (newCommentsList.length < photosArray[photoId].comments.length) {
          window.preview.drawCommentInformation(newCommentsList);
        } else {
          newCommentsList = Array.from(photosArray[photoId].comments);
          window.preview.drawCommentInformation(newCommentsList);
          loadButton.removeEventListener('click', loadButtonClickHandler);
          loadButton.classList.add('visually-hidden');
        }
      };
      loadButton.addEventListener('click', loadButtonClickHandler);

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

  var drawFilteredPhotos = function (photosArray) {
    window.drawPhotos(photosArray);
    markPhotos();
    addBigPhotoHandlers(photosArray);
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

  window.backend.load(drawFilteredPhotos, errorLoadHandler);

  window.gallery = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    errorLoadHandler: errorLoadHandler,
    drawFilteredPhotos: drawFilteredPhotos
  };
})();
