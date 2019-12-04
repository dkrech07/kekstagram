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

  var countCommentsNumber = function (photosArray, photoId, number) {

    var socialHeader = window.preview.bigPicture.querySelector('.social__header');
    var commentsElement = window.preview.bigPicture.querySelector('.comments-count');
    var counterElement = window.preview.bigPicture.querySelector('.social__comment-count');
    var fragment = document.createDocumentFragment();

    var currentValue = commentsElement.cloneNode();
    currentValue.textContent = number + ' из ';

    var allComments = commentsElement.cloneNode();
    allComments.textContent = photosArray[photoId].comments.length + ' комментариев'

    var counter = counterElement.cloneNode();

    counter.appendChild(currentValue);
    counter.appendChild(allComments);

    fragment.appendChild(counter);

    counterElement.remove();
    socialHeader.after(fragment);
  };

  var addPhotoHandle = function (photosArray, photoId) {
    if (photoId || photoId === 0) {

      var commentsNumber = photosArray[photoId].comments.length;
      var commentsList = Array.from(photosArray[photoId].comments);
      var photoDisplayStep = DEFAULT_COMMENTS_NUMBER;

      var displayLoadButton = function () {
        if (commentsNumber > DEFAULT_COMMENTS_NUMBER) {
          loadButton.classList.remove('visually-hidden');
          commentsList.length = DEFAULT_COMMENTS_NUMBER;
          window.preview.drawCommentInformation(commentsList);
          countCommentsNumber(photosArray, photoId, DEFAULT_COMMENTS_NUMBER);
        } else {
          loadButton.classList.add('visually-hidden');
          window.preview.drawCommentInformation(commentsList);
          countCommentsNumber(photosArray, photoId, commentsNumber);
        }
      };

      var removeBigPictureListeners = function () {
        closeBigPictureButton.removeEventListener('click', bigPictureCloseHandler);
        document.removeEventListener('keydown', bigPictureEscHandler);
        loadButton.removeEventListener('click', loadButtonClickHandler);
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

      var loadButtonClickHandler = function (evt) {
        evt.preventDefault();

        photoDisplayStep += DEFAULT_COMMENTS_NUMBER;
        var newCommentsList = Array.from(photosArray[photoId].comments);
        newCommentsList.length = commentsList.length - (commentsList.length - photoDisplayStep);
        countCommentsNumber(photosArray, photoId, newCommentsList.length);

        if (newCommentsList.length > photosArray[photoId].comments.length) {
          newCommentsList = Array.from(photosArray[photoId].comments);
          window.preview.drawCommentInformation(newCommentsList);
          countCommentsNumber(photosArray, photoId, newCommentsList.length);
          loadButton.removeEventListener('click', loadButtonClickHandler);
          loadButton.classList.add('visually-hidden');
        }

        window.preview.drawCommentInformation(newCommentsList);
      };

      window.preview.drawBigPicture(photosArray, photoId);
      displayLoadButton();

      closeBigPictureButton.addEventListener('click', bigPictureCloseHandler);
      document.addEventListener('keydown', bigPictureEscHandler);
      loadButton.addEventListener('click', loadButtonClickHandler);
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
