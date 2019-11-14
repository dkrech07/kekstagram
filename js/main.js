'use strict';

var MAX_COMMENT_LENGTH = 140;

var MAX_EFFECT_LEVEL = 100;
var FOBOS_EFFECT_LEVEL = 25;
var HEAT_EFFECT_LEVEL = 33;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var ALERT_COLOR = '#FF4E4E';
var HASHTAGS_NUMBER = 5;
var HASHTAG_LENGTH = 20;

var uploadButton = document.querySelector('#upload-file');
var imageForm = document.querySelector('.img-upload__overlay');
var closeFormButton = imageForm.querySelector('.img-upload__cancel');
var effectTypeButtons = imageForm.querySelectorAll('.effects__radio');

var effectLevelLine = imageForm.querySelector('.effect-level__line');
var effectLevelPin = imageForm.querySelector('.effect-level__pin');
var lineDepth = imageForm.querySelector('.effect-level__depth');
var effectLevelValue = imageForm.querySelector('.effect-level__value');
var uploadImage = imageForm.querySelector('.img-upload__preview img');
var effectLevelSlider = imageForm.querySelector('.img-upload__effect-level');

var uploadForm = document.querySelector('.img-upload__form');
var hashtagsInput = uploadForm.querySelector('.text__hashtags');
var formCommentInput = uploadForm.querySelector('.text__description');
var hashtagsArray = [];
var hashtagsErrorMessage = '';

var getEffectDefault = function () {
  effectLevelPin.style.left = MAX_EFFECT_LEVEL + '%';
  lineDepth.style.width = MAX_EFFECT_LEVEL + '%';
  uploadImage.style.filter = null;
};

var effectClickHandler = function (evt) {
  getEffectDefault();

  var target = evt.target;

  if (uploadImage.classList.value) {
    uploadImage.classList.remove(uploadImage.classList.value);
  }
  uploadImage.classList.add('effects__preview--' + target.value);

  if (uploadImage.classList.value === 'effects__preview--none') {
    effectLevelSlider.classList.add('hidden');
  } else {
    effectLevelSlider.classList.remove('hidden');
  }
};

var addEffectHandlers = function () {
  for (var i = 0; i < effectTypeButtons.length; i++) {
    effectTypeButtons[i].addEventListener('click', effectClickHandler);
  }
};

var removeEffectHandlers = function () {
  for (var i = 0; i < effectTypeButtons.length; i++) {
    effectTypeButtons[i].removeEventListener('click', effectClickHandler);
  }
};

var changeEffectLevel = function (value) {
  var effectButtonActive = imageForm.querySelector('input[name="effect"]:checked');
  var checkedEffect = effectButtonActive.value;

  if (checkedEffect === 'none') {
    uploadImage.style.filter = null;
  }

  if (checkedEffect === 'chrome') {
    uploadImage.style.filter = 'grayscale' + '(' + value / MAX_EFFECT_LEVEL + ')';
  }

  if (checkedEffect === 'sepia') {
    uploadImage.style.filter = 'sepia' + '(' + value / MAX_EFFECT_LEVEL + ')';
  }

  if (checkedEffect === 'marvin') {
    uploadImage.style.filter = 'invert' + '(' + value + '%)';
  }

  if (checkedEffect === 'phobos') {
    uploadImage.style.filter = 'blur' + '(' + Math.floor(value / FOBOS_EFFECT_LEVEL) + 'px)';
  }

  if (checkedEffect === 'heat') {
    uploadImage.style.filter = 'brightness' + '(' + Math.ceil(value / HEAT_EFFECT_LEVEL) + ')';
  }
};

var pinMoveHandler = function (evt) {
  var effectLineWidth = effectLevelLine.offsetWidth;
  var valueX = evt.offsetX;
  effectLevelValue.value = Math.floor(valueX / effectLineWidth * MAX_EFFECT_LEVEL);

  effectLevelPin.style.left = valueX + 'px';
  lineDepth.style.width = valueX + 'px';

  changeEffectLevel(effectLevelValue.value);
};

var scaleControlValue = imageForm.querySelector('.scale__control--value');
var scaleControlSmaller = imageForm.querySelector('.scale__control--smaller');
var scaleControlBigger = imageForm.querySelector('.scale__control--bigger');

var changeScale = function (value) {
  uploadImage.style.transform = 'scale' + '(' + (value / MAX_SCALE) + ')';
};

scaleControlValue.value = MAX_SCALE;
var scaleSmallerClickHandler = function () {
  if (scaleControlValue.value > MIN_SCALE) {
    scaleControlValue.value = parseInt(scaleControlValue.value, 10) - MIN_SCALE;
  }
  changeScale(scaleControlValue.value);
};

var scaleBiggerClickHandler = function () {
  if (scaleControlValue.value < MAX_SCALE) {
    scaleControlValue.value = parseInt(scaleControlValue.value, 10) + MIN_SCALE;
  }
  changeScale(scaleControlValue.value);
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
  if (evt.keyCode === window.ESC_KEYCODE) {
    removeChangeHandler();
  }
};

var removeChangeHandler = function () {
  imageForm.classList.add('hidden');
  removeCommentHandlers();
  removeHashtagsHandlers();
  removeEffectHandlers();
  scaleControlSmaller.removeEventListener('click', scaleSmallerClickHandler);
  scaleControlBigger.removeEventListener('click', scaleBiggerClickHandler);
  effectLevelLine.removeEventListener('mouseup', pinMoveHandler);
  closeFormButton.removeEventListener('click', removeChangeHandler);
  document.removeEventListener('keydown', closeFormEscHandler);
  uploadButton.value = null;
};

var uploadChangeHandler = function () {
  imageForm.classList.remove('hidden');
  addCommentHandlers();
  addHashtagsHandlers();
  addEffectHandlers();
  scaleControlSmaller.addEventListener('click', scaleSmallerClickHandler);
  scaleControlBigger.addEventListener('click', scaleBiggerClickHandler);
  effectLevelLine.addEventListener('mouseup', pinMoveHandler);
  closeFormButton.addEventListener('click', removeChangeHandler);
  document.addEventListener('keydown', closeFormEscHandler);
};

getEffectDefault();
effectLevelSlider.classList.add('hidden');
uploadButton.addEventListener('change', uploadChangeHandler);
