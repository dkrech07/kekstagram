'use strict';
// preview.js — модуль для отрисовки увеличенного изображения;
(function () {

  var bigPicture = document.querySelector('.big-picture');

  var removeChild = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  var hideBigPhotoElements = function () {
    var commentsCounter = window.preview.bigPicture.querySelector('.social__comment-count');
    var commentsLoader = window.preview.bigPicture.querySelector('.comments-loader');
    commentsCounter.classList.add('visually-hidden');
    commentsLoader.classList.add('visually-hidden');
  };

  var drawBigPicture = function (photosArray, photoId) {
    window.preview.bigPicture.classList.remove('hidden');
    var element = photosArray[photoId];

    drawPhotoInformation(element);

    hideBigPhotoElements();
  };

  var drawPhotoInformation = function (element) {
    var image = window.preview.bigPicture.querySelector('.big-picture__img img');
    image.src = element.url;

    var likesCount = window.preview.bigPicture.querySelector('.likes-count');
    likesCount.textContent = element.likes;

    var commentsCount = window.preview.bigPicture.querySelector('.comments-count');
    commentsCount.textContent = element.comments.length;

    var descriptionPhoto = window.preview.bigPicture.querySelector('.social__caption');
    descriptionPhoto.textContent = element.description;
  };

  var drawCommentInformation = function (commentsList) {
    var socialComments = window.preview.bigPicture.querySelector('.social__comments');
    var template = socialComments.querySelector('.social__comment');
    var fragment = document.createDocumentFragment();

    removeChild(socialComments);
    for (var i = 0; i < commentsList.length; i++) {
      var comment = template.cloneNode(true);
      var commentPhoto = comment.querySelector('.social__picture');
      var commentMessage = comment.querySelector('.social__text');
      commentPhoto.src = commentsList[i].avatar;
      commentPhoto.alt = commentsList[i].name;
      commentMessage.textContent = commentsList[i].message;
      fragment.appendChild(comment);
    }
    socialComments.appendChild(fragment);
  };

  window.preview = {
    bigPicture: bigPicture,
    drawBigPicture: drawBigPicture,
    removeChild: removeChild,
    drawCommentInformation: drawCommentInformation
  };

})();
