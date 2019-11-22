'use strict';
// backend.js — модуль, который работает с сервером.
(function() {

  window.backend = {
    load: function(onSuccess, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function() {
        if (xhr.status === 200) {
          onSuccess(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function() {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function() {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10s

      xhr.open('GET', URL);
      xhr.send();
    },
    upload: function(data, onSuccess) {
      var URL = 'https://js.dump.academy/kekstagram';

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function() {
        onSuccess(xhr.response);
      });

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };

})();