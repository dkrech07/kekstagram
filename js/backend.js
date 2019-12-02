'use strict';
// backend.js — модуль, который работает с сервером.
(function () {

  var TIMEOUT_DURATION = 5000;
  var STATUS_OK = 200;
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var handleErrors = function (xhr, load, error) {
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        load(xhr.response);
      } else {
        error('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      error('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      error('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  var makeRequest = function (url, load, error, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    handleErrors(xhr, load, error);

    xhr.timeout = TIMEOUT_DURATION;

    var method = data ? 'POST' : 'GET';
    xhr.open(method, url);
    xhr.send(data);
  };

  window.backend = {
    load: function (onLoad, onError) {
      makeRequest(LOAD_URL, onLoad, onError);
    },
    upload: function (data, onLoad, onError) {
      makeRequest(UPLOAD_URL, onLoad, onError, data);
    }
  };

})();
