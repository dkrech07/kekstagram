'use strict';
// form.js — модуль, который работает с формой редактирования изображения.
(function() {

  var uploadButton = document.querySelector('#upload-file');
  var closeFormButton = window.effects.imageForm.querySelector('.img-upload__cancel');

  var scaleControlSmaller = window.effects.imageForm.querySelector('.scale__control--smaller');
  var scaleControlBigger = window.effects.imageForm.querySelector('.scale__control--bigger');

  var closeFormEscHandler = function(evt) {
    if (evt.keyCode === window.gallery.ESC_KEYCODE) {
      removeChangeHandler();
    }
  };

  var removeChangeHandler = function() {
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
    uploadButton.value = null;
    window.message.uploadForm.reset();
  };

  var uploadChangeHandler = function() {
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
  };

  window.effects.getEffectDefault();
  window.effects.effectLevelSlider.classList.add('hidden');
  uploadButton.addEventListener('change', uploadChangeHandler);

console.log(window.effects.imageForm);
  // window.effects.imageForm.addEventListener('submit', function(evt) {
  //   window.backend.upload(new FormData(form), function(response) {
  //     console.log('ok');
  //     window.effects.imageForm.classList.add('hidden');
  //   });
  //   evt.preventDefault();
  // });

})();
