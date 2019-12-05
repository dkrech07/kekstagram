'use strict';
// message.js — модуль для обработки хэш-тегов и сообщения;
(function () {

  var MAX_COMMENT_LENGTH = 140;
  var ALERT_COLOR = '#FF4E4E';
  var HASHTAGS_NUMBER = 5;
  var HASHTAG_LENGTH = 20;

  var uploadForm = document.querySelector('.img-upload__form');
  var hashtagsInput = uploadForm.querySelector('.text__hashtags');
  var formCommentInput = uploadForm.querySelector('.text__description');
  var hashtagsArray = [];
  var hashtagsErrorMessage = '';

  window.message = {
    uploadForm: uploadForm,
    addHashtagsHandlers: function () {
      hashtagsInput.addEventListener('change', hashtagsInputChange);
      hashtagsInput.addEventListener('keydown', function (evt) {
        evt.stopPropagation();
      });
    },
    removeHashtagsHandlers: function () {
      hashtagsInput.removeEventListener('change', hashtagsInputChange);
      hashtagsInput.removeEventListener('keydown', function (evt) {
        evt.stopPropagation();
      });
    },
    addCommentHandlers: function () {
      formCommentInput.addEventListener('change', formCommentClickHandler);
      formCommentInput.addEventListener('keydown', function (evt) {
        evt.stopPropagation();
      });
    },
    removeCommentHandlers: function () {
      formCommentInput.removeEventListener('change', formCommentClickHandler);
      formCommentInput.removeEventListener('keydown', function (evt) {
        evt.stopPropagation();
      });
    }
  };

  var checkDuplication = function (array) {
    var checkingArray = Array.from(array);

    checkingArray.forEach(function (it) {
      it = it.toLowerCase();
    });

    var duplicate = false;

    checkingArray.forEach(function (it) {
      checkingArray.forEach(function (item, index) {
          if (index > 0 && it === item) {
            duplicate = true;
          }
      });
    });

    return duplicate;
  };

  var validateHashtags = function (array) {
    array.forEach(function (it) {
        if (it.charAt(0) !== '#') {
          hashtagsErrorMessage = 'Хэш-тэг должен начинаться с #';
          hashtagsInput.style.borderColor = ALERT_COLOR;
        } else if (it === '#') {
          hashtagsErrorMessage = 'Хеш-тег не может состоять только из одной #';
          hashtagsInput.style.borderColor = ALERT_COLOR;
        } else if (it.indexOf('#', 1) > 0) {
          hashtagsErrorMessage = 'хэш-теги должны разделяться пробелами';
        } else if (array.length > HASHTAGS_NUMBER) {
          hashtagsErrorMessage = 'Нельзя указать больше пяти хэш-тегов';
        } else if (it.length > HASHTAG_LENGTH) {
          hashtagsErrorMessage = 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
        } else {
          hashtagsErrorMessage = '';
        }
      });

    if (checkDuplication(array)) {
      hashtagsErrorMessage = 'Один и тот же хэш-тег не может быть использован дважды';
    }
    hashtagsInput.setCustomValidity(hashtagsErrorMessage);
  };

  var hashtagsInputChange = function (evt) {
    hashtagsArray = evt.target.value.split(' ');
    validateHashtags(hashtagsArray);
  };

  var validateFormComment = function (target) {
    if (target.length > MAX_COMMENT_LENGTH) {
      formCommentInput.setCustomValidity('Длина комментария не может составлять больше 140 символов');
      formCommentInput.style.borderColor = ALERT_COLOR;
    } else {
      formCommentInput.setCustomValidity('');
    }
  };

  var formCommentClickHandler = function (evt) {
    var target = evt.target.value;
    validateFormComment(target);
  };

})();
