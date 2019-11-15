'use strict';
// effects.js — модуль для отрисовки эффектов изображения;
(function () {

  var MAX_EFFECT_LEVEL = 100;
  var FOBOS_EFFECT_LEVEL = 25;
  var HEAT_EFFECT_LEVEL = 33;
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;

  var effectTypeButtons = window.data.imageForm.querySelectorAll('.effects__radio');
  var effectLevelPin = window.data.imageForm.querySelector('.effect-level__pin');
  var lineDepth = window.data.imageForm.querySelector('.effect-level__depth');
  var effectLevelValue = window.data.imageForm.querySelector('.effect-level__value');
  var uploadImage = window.data.imageForm.querySelector('.img-upload__preview img');
  var scaleControlValue = window.data.imageForm.querySelector('.scale__control--value');

  window.effects = {
    effectLevelLine: window.data.imageForm.querySelector('.effect-level__line'),
    effectLevelSlider: window.data.imageForm.querySelector('.img-upload__effect-level'),
    getEffectDefault: function () {
      effectLevelPin.style.left = MAX_EFFECT_LEVEL + '%';
      lineDepth.style.width = MAX_EFFECT_LEVEL + '%';
      uploadImage.style.filter = null;
    },
    addEffectHandlers: function () {
      for (var i = 0; i < effectTypeButtons.length; i++) {
        effectTypeButtons[i].addEventListener('click', effectClickHandler);
      }
    },
    removeEffectHandlers: function () {
      for (var i = 0; i < effectTypeButtons.length; i++) {
        effectTypeButtons[i].removeEventListener('click', effectClickHandler);
      }
    },
    pinMoveHandler: function (evt) {
      var effectLineWidth = window.effects.effectLevelLine.offsetWidth;
      var valueX = evt.offsetX;
      effectLevelValue.value = Math.floor(valueX / effectLineWidth * MAX_EFFECT_LEVEL);

      effectLevelPin.style.left = valueX + 'px';
      lineDepth.style.width = valueX + 'px';

      changeEffectLevel(effectLevelValue.value);
    },
    scaleSmallerClickHandler: function () {
      if (scaleControlValue.value > MIN_SCALE) {
        scaleControlValue.value = parseInt(scaleControlValue.value, 10) - MIN_SCALE;
      }
      changeScale(scaleControlValue.value);
    },
    scaleBiggerClickHandler: function () {
      if (scaleControlValue.value < MAX_SCALE) {
        scaleControlValue.value = parseInt(scaleControlValue.value, 10) + MIN_SCALE;
      }
      changeScale(scaleControlValue.value);
    }
  };

  var effectClickHandler = function (evt) {
    window.effects.getEffectDefault();

    var target = evt.target;

    if (uploadImage.classList.value) {
      uploadImage.classList.remove(uploadImage.classList.value);
    }
    uploadImage.classList.add('effects__preview--' + target.value);

    if (uploadImage.classList.value === 'effects__preview--none') {
      window.effects.effectLevelSlider.classList.add('hidden');
    } else {
      window.effects.effectLevelSlider.classList.remove('hidden');
    }
  };

  var changeEffectLevel = function (value) {
    var effectButtonActive = window.data.imageForm.querySelector('input[name="effect"]:checked');
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

  var changeScale = function (value) {
    uploadImage.style.transform = 'scale' + '(' + (value / MAX_SCALE) + ')';
  };

  scaleControlValue.value = MAX_SCALE;

})();
