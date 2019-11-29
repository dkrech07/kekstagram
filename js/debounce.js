'use strict';
// Файл debounce.js
(function () {
  var DEBOUNCE_INTERVAL = 5000; // ms

  window.debounce = function (callback) {
    var lastTimeout = null;

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
        callback;
      }, DEBOUNCE_INTERVAL);
  };

})();
