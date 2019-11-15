'use strict';

var MAX_COMMENT_LENGTH = 140;
var ALERT_COLOR = '#FF4E4E';
var HASHTAGS_NUMBER = 5;
var HASHTAG_LENGTH = 20;

var uploadButton = document.querySelector('#upload-file');
var closeFormButton = window.data.imageForm.querySelector('.img-upload__cancel');

var scaleControlSmaller = window.data.imageForm.querySelector('.scale__control--smaller');
var scaleControlBigger = window.data.imageForm.querySelector('.scale__control--bigger');

var uploadForm = document.querySelector('.img-upload__form');
var hashtagsInput = uploadForm.querySelector('.text__hashtags');
var formCommentInput = uploadForm.querySelector('.text__description');
var hashtagsArray = [];
var hashtagsErrorMessage = '';

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

var addHashtagsHandlers = function () {
  hashtagsInput.addEventListener('change', hashtagsInputChange);
  hashtagsInput.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });
};

var removeHashtagsHandlers = function () {
  hashtagsInput.removeEventListener('change', hashtagsInputChange);
  hashtagsInput.removeEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });
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

var addCommentHandlers = function () {
  formCommentInput.addEventListener('change', formCommentClickHandler);
  formCommentInput.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });
};

var removeCommentHandlers = function () {
  formCommentInput.removeEventListener('change', formCommentClickHandler);
  formCommentInput.removeEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });
};

var closeFormEscHandler = function (evt) {
  if (evt.keyCode === window.gallery.ESC_KEYCODE) {
    removeChangeHandler();
  }
};

var removeChangeHandler = function () {
  window.data.imageForm.classList.add('hidden');
  removeCommentHandlers();
  removeHashtagsHandlers();
  window.effects.removeEffectHandlers();
  scaleControlSmaller.removeEventListener('click', window.effects.scaleSmallerClickHandler);
  scaleControlBigger.removeEventListener('click', window.effects.scaleBiggerClickHandler);
  window.effects.effectLevelLine.removeEventListener('mouseup', window.effects.pinMoveHandler);
  closeFormButton.removeEventListener('click', removeChangeHandler);
  document.removeEventListener('keydown', closeFormEscHandler);
  uploadButton.value = null;
};

var uploadChangeHandler = function () {
  window.data.imageForm.classList.remove('hidden');
  addCommentHandlers();
  addHashtagsHandlers();
  window.effects.addEffectHandlers();
  scaleControlSmaller.addEventListener('click', window.effects.scaleSmallerClickHandler);
  scaleControlBigger.addEventListener('click', window.effects.scaleBiggerClickHandler);
  window.effects.effectLevelLine.addEventListener('mouseup', window.effects.pinMoveHandler);
  closeFormButton.addEventListener('click', removeChangeHandler);
  document.addEventListener('keydown', closeFormEscHandler);
};

window.effects.getEffectDefault();
window.effects.effectLevelSlider.classList.add('hidden');
uploadButton.addEventListener('change', uploadChangeHandler);
