'use strict';
// Файл debounce.js
(function () {
  var DEBOUNCE_INTERVAL = 2000; // ms

  window.debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb();
      }, DEBOUNCE_INTERVAL);
    };
  };

  // var lastTimeout = null;
  //
  // if (lastTimeout) {
  //   window.clearTimeout(lastTimeout);
  // }
  // lastTimeout = window.setTimeout(function () {
  //   window.backend.load(updatePhotos, window.gallery.errorLoadHandler);
  // }, 2000);

})();
