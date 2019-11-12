'use strict';

var PHOTOS_NUMBER = 25;
var AVATARS_NUMBER = 6;
var MAX_LENGTH_COMMENT = 2;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MAX_COMMENTS = 10;
var ESC_KEYCODE = 27;
var MAX_EFFECT_LEVEL = 100;
var FOBOS_EFFECT_LEVEL = 25;
var HEAT_EFFECT_LEVEL = 33;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var ALERT_COLOR = '#FF4E4E';
var HASHTAGS_NUMBER = 5;
var HASHTAG_LENGTH = 20;

var COMMENTS_LIST = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTION_LIST = [
  'Тестим новую камеру!',
  ' Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var NAMES_LIST = ['Татьяна', 'Николай', 'Снежанна', 'Ирина', 'Анжела', 'Игорь', 'Карась'];

var bigPicture = document.querySelector('.big-picture');

var getRandom = function (number) {
  return Math.floor(Math.random() * number);
};

var getRandomDouble = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var removeChild = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var getRandomDescription = function () {
  var description = DESCRIPTION_LIST[getRandom(DESCRIPTION_LIST.length)];
  return description;
};

var getRandomLikes = function () {
  var likes = getRandomDouble(MIN_LIKES, MAX_LIKES);
  return likes;
};

var getRandomMessage = function () {
  var newArray = Array.from(COMMENTS_LIST);
  var message = newArray.sort(compareRandom);
  message.length = getRandom(MAX_LENGTH_COMMENT) + 1;
  return message.join(', ');
};

var getRandomName = function () {
  var name = NAMES_LIST[getRandom(NAMES_LIST.length)];
  return name;
};

var getRandomComment = function () {
  var comment = {
    avatar: 'img/avatar-' + (getRandom(AVATARS_NUMBER) + 1) + '.svg',
    message: getRandomMessage(),
    name: getRandomName()
  };
  return comment;
};

var getAllCommenst = function () {
  var commentArray = [];
  for (var i = 0; i < getRandom(MAX_COMMENTS) + 1; i++) {
    commentArray.push(getRandomComment());
  }
  return commentArray;
};

var getPhotosArray = function () {
  var photosArray = [];
  for (var i = 0; i < PHOTOS_NUMBER; i++) {
    var photo = {
      url: 'photos/' + (i + 1) + '.jpg',
      description: getRandomDescription(),
      likes: getRandomLikes(),
      comments: getAllCommenst()
    };
    photosArray.push(photo);
  }
  return photosArray;
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

var drawPhotos = function () {
  var pictures = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < PHOTOS_NUMBER; i++) {
    var photo = getPhoto(getPhotosArray()[i]);
    fragment.appendChild(photo);
  }

  pictures.appendChild(fragment);
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
  var element = getPhotosArray()[number];

  drawPhotoInformation(number, element);
  drawCommentInformation(number, element);

  hideBigPhotoElements();
};

drawPhotos();
// drawBigPicture(0);

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

var closeFormEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeChangeHandler();
  }
};

var removeChangeHandler = function () {
  imageForm.classList.add('hidden');
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
