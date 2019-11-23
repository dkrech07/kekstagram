'use strict';
// effects.js — модуль для отрисовки эффектов изображения;
(function () {

  var MAX_EFFECT_LEVEL = 100;
  var FOBOS_EFFECT_LEVEL = 33;
  var HEAT_EFFECT_LEVEL = 50;
  var HEAT_EFFECT_CORRECTION = 0.5;
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var MIN_EFFECT_VALUE = 0;

  var imageForm = document.querySelector('.img-upload__overlay');
  var effectTypeButtons = imageForm.querySelectorAll('.effects__radio');
  var lineDepth = imageForm.querySelector('.effect-level__depth');
  var effectLevelValue = imageForm.querySelector('.effect-level__value');
  var uploadImage = imageForm.querySelector('.img-upload__preview img');
  var scaleControlValue = imageForm.querySelector('.scale__control--value');

  var getEffectDefault = function () {
    window.effects.effectLevelPin.style.left = MAX_EFFECT_LEVEL + '%';
    lineDepth.style.width = MAX_EFFECT_LEVEL + '%';
    uploadImage.style.filter = null;
    uploadImage.classList = '';
    changeEffectLevel(MAX_EFFECT_LEVEL);
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

  var getScaleDefault = function () {
    scaleControlValue.value = MAX_SCALE;
    changeScale(scaleControlValue.value);
  };

  var levelLineClickHandler = function (evt) {
    if (evt.target.className === 'effect-level__line' || evt.target.className === 'effect-level__depth') {
      window.effects.effectLevelPin.style.left = evt.offsetX + 'px';
      checkLevelEffect(evt.offsetX);
    }
  };

  var pinMoveHandler = function (evt) {
    evt.preventDefault();

    var startCoord = evt.clientX;

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = startCoord - moveEvt.clientX;

      startCoord = moveEvt.clientX;

      var pinShiftCoord = window.effects.effectLevelPin.offsetLeft - shift;

      var getPinMoveLimits = function () {
        var effectLineWidth = window.effects.effectLevelLine.offsetWidth;
        if (pinShiftCoord < MIN_EFFECT_VALUE) {
          pinShiftCoord = MIN_EFFECT_VALUE;
        }
        if (pinShiftCoord > effectLineWidth) {
          pinShiftCoord = effectLineWidth;
        }
      };

      getPinMoveLimits();

      window.effects.effectLevelPin.style.left = pinShiftCoord + 'px';

      checkLevelEffect(pinShiftCoord);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      checkLevelEffect(window.effects.effectLevelPin.offsetLeft);

      if (dragged) {
        var onClickPreventDefault = function () {
          evt.preventDefault();
          window.effects.effectLevelPin.removeEventListener('click', onClickPreventDefault);
        };
        window.effects.effectLevelPin.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.effects = {
    imageForm: imageForm,
    effectLevelLine: imageForm.querySelector('.effect-level__line'),
    effectLevelPin: imageForm.querySelector('.effect-level__pin'),
    effectLevelSlider: imageForm.querySelector('.img-upload__effect-level'),
    getEffectDefault: getEffectDefault,
    addEffectHandlers: addEffectHandlers,
    removeEffectHandlers: removeEffectHandlers,
    scaleSmallerClickHandler: scaleSmallerClickHandler,
    scaleBiggerClickHandler: scaleBiggerClickHandler,
    levelLineClickHandler: levelLineClickHandler,
    pinMoveHandler: pinMoveHandler,
    getScaleDefault: getScaleDefault
  };

  var checkLevelEffect = function (valueX) {
    var effectLineWidth = window.effects.effectLevelLine.offsetWidth;
    effectLevelValue.value = Math.floor(valueX / effectLineWidth * MAX_EFFECT_LEVEL);
    lineDepth.style.width = valueX + 'px';
    changeEffectLevel(effectLevelValue.value);
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
      uploadImage.style.filter = 'blur' + '(' + Math.round(value / FOBOS_EFFECT_LEVEL) + 'px)';
    }

    if (checkedEffect === 'heat') {
      uploadImage.style.filter = 'brightness' + '(' + Math.ceil(value / HEAT_EFFECT_LEVEL + HEAT_EFFECT_CORRECTION) + ')';
    }
  };

  var changeScale = function (value) {
    uploadImage.style.transform = 'scale' + '(' + (value / MAX_SCALE) + ')';
  };

  scaleControlValue.value = MAX_SCALE;

})();
