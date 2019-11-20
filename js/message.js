'use strict';
// message.js — модуль для обработки хэш-тегов и сообщения;
(function () {

  var MAX_COMMENT_LENGTH = 140;
  var ALERT_COLOR = '#FF4E4E';
  var HASHTAGS_NUMBER = 5;
  var HASHTAG_LENGTH = 20;


  var hashtagsInput = window.preview.uploadForm.querySelector('.text__hashtags');
  var formCommentInput = window.preview.uploadForm.querySelector('.text__description');
  var hashtagsArray = [];
  var hashtagsErrorMessage = '';

  window.message = {
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
    for (var i = 0; i < checkingArray.length; i++) {
      checkingArray[i] = checkingArray[i].toLowerCase();
    }
    var duplicate = false;
    for (var j = 0; j < checkingArray.length; j++) {
      var currentElement = checkingArray[j];
      for (var k = j + 1; k < checkingArray.length; k++) {
        var checkElement = checkingArray[k];
        if (currentElement === checkElement) {
          duplicate = true;
        }
      }
    }
    return duplicate;
  };

  var validateHashtags = function (array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].charAt(0) !== '#') {
        hashtagsErrorMessage = 'Хэш-тэг должен начинаться с #';
        hashtagsInput.style.borderColor = ALERT_COLOR;
      } else if (array[i] === '#') {
        hashtagsErrorMessage = 'Хеш-тег не может состоять только из одной #';
        hashtagsInput.style.borderColor = ALERT_COLOR;
      } else if (array[i].indexOf('#', 1) > 0) {
        hashtagsErrorMessage = 'хэш-теги должны разделяться пробелами';
      } else if (array.length > HASHTAGS_NUMBER) {
        hashtagsErrorMessage = 'Нельзя указать больше пяти хэш-тегов';
      } else if (array[i].length > HASHTAG_LENGTH) {
        hashtagsErrorMessage = 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
      } else {
        hashtagsErrorMessage = '';
      }
    }
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
    } else {
      formCommentInput.setCustomValidity('');
    }
  };

  var formCommentClickHandler = function (evt) {
    var target = evt.target.value;
    validateFormComment(target);
  };

})();
