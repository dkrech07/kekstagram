'use strict';
// form.js — модуль, который работает с формой редактирования изображения.
(function () {

  var uploadButton = document.querySelector('#upload-file');
  var closeFormButton = window.effects.imageForm.querySelector('.img-upload__cancel');

  var scaleControlSmaller = window.effects.imageForm.querySelector('.scale__control--smaller');
  var scaleControlBigger = window.effects.imageForm.querySelector('.scale__control--bigger');

  var closeFormEscHandler = function (evt) {
    if (evt.keyCode === window.gallery.ESC_KEYCODE) {
      removeChangeHandler();
    }
  };

  var resetUploadForm = function () {
    window.effects.getScaleDefault();
    window.effects.getEffectDefault();
    uploadButton.value = null;
    window.message.uploadForm.reset();
    window.effects.effectLevelSlider.classList.add('hidden');
  };

  var removeChangeHandler = function () {
    window.effects.imageForm.classList.add('hidden');
    window.message.removeCommentHandlers();
    window.message.removeHashtagsHandlers();
    window.effects.removeEffectHandlers();
    scaleControlSmaller.removeEventListener('click', window.effects.scaleSmallerClickHandler);
    scaleControlBigger.removeEventListener('click', window.effects.scaleBiggerClickHandler);
    window.effects.effectLevelPin.removeEventListener('mousedown', window.effects.pinMoveHandler);
    window.effects.effectLevelLine.removeEventListener('mouseup', window.effects.levelLineClickHandler);
    closeFormButton.removeEventListener('click', removeChangeHandler);
    document.removeEventListener('keydown', closeFormEscHandler);
    resetUploadForm();
    uploadButton.addEventListener('change', uploadChangeHandler);
  };

  var uploadChangeHandler = function () {
    window.effects.imageForm.classList.remove('hidden');
    window.message.addCommentHandlers();
    window.message.addHashtagsHandlers();
    window.effects.addEffectHandlers();
    scaleControlSmaller.addEventListener('click', window.effects.scaleSmallerClickHandler);
    scaleControlBigger.addEventListener('click', window.effects.scaleBiggerClickHandler);
    window.effects.effectLevelPin.addEventListener('mousedown', window.effects.pinMoveHandler);
    window.effects.effectLevelLine.addEventListener('mouseup', window.effects.levelLineClickHandler);
    closeFormButton.addEventListener('click', removeChangeHandler);
    document.addEventListener('keydown', closeFormEscHandler);
    window.effects.getScaleDefault();
    window.effects.getEffectDefault();
    uploadButton.removeEventListener('change', uploadChangeHandler);
  };

  // Сообщение об успешной отправке данных на сервер;
  var generateSuccessMessage = function () {
    var template = document.querySelector('#success').content.querySelector('.success');
    var element = template.cloneNode(true);

    var fragment = document.createDocumentFragment();
    fragment.appendChild(element);

    var main = document.querySelector('main');
    main.appendChild(fragment);
  };

  // Отправка данных на сервер;
  var uploadHandler = function () {
    removeChangeHandler();
    generateSuccessMessage();
  };

  window.message.uploadForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(window.message.uploadForm), uploadHandler, window.gallery.generateErrorMessage);
    evt.preventDefault();
  });

  uploadButton.addEventListener('change', uploadChangeHandler);

})();
