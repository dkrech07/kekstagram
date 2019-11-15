'use strict';
// form.js — модуль, который работает с формой редактирования изображения.
(function () {

  var uploadButton = document.querySelector('#upload-file');
  var closeFormButton = window.data.imageForm.querySelector('.img-upload__cancel');

  var scaleControlSmaller = window.data.imageForm.querySelector('.scale__control--smaller');
  var scaleControlBigger = window.data.imageForm.querySelector('.scale__control--bigger');

  var closeFormEscHandler = function (evt) {
    if (evt.keyCode === window.gallery.ESC_KEYCODE) {
      removeChangeHandler();
    }
  };

  var removeChangeHandler = function () {
    window.data.imageForm.classList.add('hidden');
    window.message.removeCommentHandlers();
    window.message.removeHashtagsHandlers();
    window.effects.removeEffectHandlers();
    scaleControlSmaller.removeEventListener('click', window.effects.scaleSmallerClickHandler);
    scaleControlBigger.removeEventListener('click', window.effects.scaleBiggerClickHandler);
    // window.effects.effectLevelLine.removeEventListener('mouseup', window.effects.pinMoveHandler);
    closeFormButton.removeEventListener('click', removeChangeHandler);
    document.removeEventListener('keydown', closeFormEscHandler);
    uploadButton.value = null;
  };

  var uploadChangeHandler = function () {
    window.data.imageForm.classList.remove('hidden');
    window.message.addCommentHandlers();
    window.message.addHashtagsHandlers();
    window.effects.addEffectHandlers();
    scaleControlSmaller.addEventListener('click', window.effects.scaleSmallerClickHandler);
    scaleControlBigger.addEventListener('click', window.effects.scaleBiggerClickHandler);
    // window.effects.effectLevelLine.addEventListener('mouseup', window.effects.pinMoveHandler);
    closeFormButton.addEventListener('click', removeChangeHandler);
    document.addEventListener('keydown', closeFormEscHandler);
  };

  window.effects.getEffectDefault();
  window.effects.effectLevelSlider.classList.add('hidden');
  uploadButton.addEventListener('change', uploadChangeHandler);

})();
