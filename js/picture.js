'use strict';
// picture.js — модуль для отрисовки миниатюры;
(function () {

  window.drawPhotos = function (photosArray) {
    var pictures = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();

    photosArray.forEach(function (it) {
      var photo = getPhoto(it);
      fragment.appendChild(photo);
    });

    pictures.appendChild(fragment);
  };

  var getPhoto = function (imageObject) {
    var template = document.querySelector('#picture').content.querySelector('.picture');
    var element = template.cloneNode(true);

    var image = element.querySelector('img');
    image.src = imageObject.url;

    var likes = element.querySelector('.picture__likes');
    likes.textContent = imageObject.likes;

    var comments = element.querySelector('.picture__comments');
    comments.textContent = imageObject.comments.length;

    return element;
  };

})();
