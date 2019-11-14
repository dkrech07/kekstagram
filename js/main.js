'use strict';


var MAX_COMMENT_LENGTH = 140;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var MAX_EFFECT_LEVEL = 100;
var FOBOS_EFFECT_LEVEL = 25;
var HEAT_EFFECT_LEVEL = 33;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var ALERT_COLOR = '#FF4E4E';
var HASHTAGS_NUMBER = 5;
var HASHTAG_LENGTH = 20;

var bigPicture = document.querySelector('.big-picture');
var closeBigPictureButton = bigPicture.querySelector('.big-picture__cancel');
var photosContainer = document.querySelector('.pictures');

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

var removeChild = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var drawPhotoInformation = function (number, element) {
  var image = bigPicture.querySelector('.big-picture__img img');
  image.src = element.url;

  var likesCount = bigPicture.querySelector('.likes-count');
  likesCount.textContent = element.likes;

  var commentsCount = bigPicture.querySelector('.comments-count');
  commentsCount.textContent = element.comments.length;

  var descriptionPhoto = bigPicture.querySelector('.social__caption');
  descriptionPhoto.textContent = element.description;
};

var drawCommentInformation = function (number, element) {
  var socialComments = bigPicture.querySelector('.social__comments');
  var template = socialComments.querySelector('.social__comment');
  var fragment = document.createDocumentFragment();

  removeChild(socialComments);
  for (var i = 0; i < element.comments.length; i++) {
    var comment = template.cloneNode(true);
    var commentPhoto = comment.querySelector('.social__picture');
    var commentMessage = comment.querySelector('.social__text');
    commentPhoto.src = element.comments[i].avatar;
    commentPhoto.alt = element.comments[i].name;
    commentMessage.textContent = element.comments[i].message;
    fragment.appendChild(comment);
  }
  socialComments.appendChild(fragment);
};

var hideBigPhotoElements = function () {
  var commentsCounter = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  commentsCounter.classList.add('visually-hidden');
  commentsLoader.classList.add('visually-hidden');
};

var drawBigPicture = function (number) {
  bigPicture.classList.remove('hidden');
  var element = window.data.getPhotosArray()[number];

  drawPhotoInformation(number, element);
  drawCommentInformation(number, element);

  hideBigPhotoElements();
};

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
  if (evt.keyCode === ESC_KEYCODE) {
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

var markPhotos = function () {
  var allPhotos = photosContainer.querySelectorAll('.picture');
  for (var i = 0; i < allPhotos.length; i++) {
    allPhotos[i].id = i;
  }
};

markPhotos();

var bigPictureCloseHandler = function () {
  bigPicture.classList.add('hidden');
  removeBigPictureListeners();
};

var bigPictureEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    bigPictureCloseHandler();
  }
};

var removeBigPictureListeners = function () {
  closeBigPictureButton.removeEventListener('click', bigPictureCloseHandler);
  document.removeEventListener('keydown', bigPictureEscHandler);
};

var addPhotoHandle = function (photoId) {
  if (photoId || photoId === 0) {
    drawBigPicture(photoId);

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
  if (evt.keyCode === ENTER_KEYCODE) {
    var target = evt.target;
    var photoId = parseInt(target.id, 10);

    addPhotoHandle(photoId);
  }
};

photosContainer.addEventListener('click', photoClickHandler);
photosContainer.addEventListener('keydown', photoEnterHandler);
