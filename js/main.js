'use strict';

var PHOTOS_NUMBER = 25;
var MAX_LENGTH_COMMENT = 2;
var MIN_LIKES = 15;
var MAX_LIKES = 200;

var COMMENTS_LIST = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var getRandom = function (number) {
  return Math.floor(Math.random() * number);
};

var getRandomDouble = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomComment = function () {
  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  var newArray = Array.from(COMMENTS_LIST);
  var comment = newArray.sort(compareRandom);

  comment.length = getRandom(MAX_LENGTH_COMMENT) + 1;

  return comment;
};


var getPhotosArray = function () {
  var photosArray = [];
  for (var i = 0; i < PHOTOS_NUMBER; i++) {
    var photo = {
      url: 'photos/' + (i + 1) + '.jpg',
      description: '',
      likes: getRandomDouble(MIN_LIKES, MAX_LIKES),
      comments: getRandomComment()
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

console.log(getPhotosArray());
drawPhotos();
