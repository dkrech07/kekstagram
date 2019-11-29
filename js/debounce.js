'use strict';
// Файл debounce.js
(function () {
  var DEBOUNCE_INTERVAL = 10000000; // ms
  var lastTimeout = null;

  window.debounce = function (callback) {

    // if (lastTimeout) {
    //   window.clearTimeout(lastTimeout);
    // }
    // lastTimeout = window.setTimeout(function () {
    //     callback();
    //     console.log('ok');
    //   }, DEBOUNCE_INTERVAL);
        console.log('ok');
  };

})();
