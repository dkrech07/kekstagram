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
var uploadForm = document.querySelector('.img-upload__overlay');
var closeFormButton = uploadForm.querySelector('.img-upload__cancel');
var effectTypeButtons = uploadForm.querySelectorAll('.effects__radio');

var effectLevelLine = uploadForm.querySelector('.effect-level__line');
var effectLevelPin = uploadForm.querySelector('.effect-level__pin');
var lineDepth = uploadForm.querySelector('.effect-level__depth');
var effectLevelValue = uploadForm.querySelector('.effect-level__value');
var uploadImage = uploadForm.querySelector('.img-upload__preview img');
var effectLevelSlider = uploadForm.querySelector('.img-upload__effect-level');

var getEffectDefault = function () {
  effectLevelPin.style = 'left: ' + MAX_EFFECT_LEVEL + '%;';
  lineDepth.style = 'width: ' + MAX_EFFECT_LEVEL + '%;';
  uploadImage.style = null;
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
  var effectButtonActive = uploadForm.querySelector('input[name="effect"]:checked');
  var checkedEffect = effectButtonActive.value;

  if (checkedEffect === 'none') {
    uploadImage.style = null;
  }

  if (checkedEffect === 'chrome') {
    uploadImage.style = 'filter: grayscale(' + value + ');';
  }

  if (checkedEffect === 'sepia') {
    uploadImage.style = 'filter: sepia(' + value + ');';
  }

  if (checkedEffect === 'marvin') {
    uploadImage.style = 'filter: invert(' + value * MAX_EFFECT_LEVEL + '%);';
  }

  if (checkedEffect === 'phobos') {
    uploadImage.style = 'filter: blur(' + Math.floor(value * MAX_EFFECT_LEVEL / FOBOS_EFFECT_LEVEL) + 'px);';
  }

  if (checkedEffect === 'heat') {
    uploadImage.style = 'filter: brightness(' + Math.ceil(value * MAX_EFFECT_LEVEL / HEAT_EFFECT_LEVEL) + ');';
  }
};

var pinMoveHandler = function (evt) {
  var effectLineWidth = effectLevelLine.offsetWidth;
  var valueX = evt.offsetX;
  effectLevelValue.value = valueX / effectLineWidth;

  effectLevelPin.style = 'left: ' + valueX + 'px;';
  lineDepth.style = 'width: ' + valueX + 'px;';

  changeEffectLevel(effectLevelValue.value);
};

var closeFormEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeChangeHandler();
  }
};

var removeChangeHandler = function () {
  uploadForm.classList.add('hidden');
  removeEffectHandlers();
  effectLevelLine.removeEventListener('mouseup', pinMoveHandler);
  closeFormButton.removeEventListener('click', removeChangeHandler);
  document.removeEventListener('keydown', closeFormEscHandler);
  uploadButton.value = null;
};

var uploadChangeHandler = function () {
  uploadForm.classList.remove('hidden');
  addEffectHandlers();
  effectLevelLine.addEventListener('mouseup', pinMoveHandler);
  closeFormButton.addEventListener('click', removeChangeHandler);
  document.addEventListener('keydown', closeFormEscHandler);
};

getEffectDefault();
effectLevelSlider.classList.add('hidden');
uploadButton.addEventListener('change', uploadChangeHandler);
