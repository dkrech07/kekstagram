'use strict';
// gallery.js — модуль, который работает с фотографией пользователя;
(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.uploadButton.addEventListener('change', function () {
    var file = window.uploadButton.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.effects.uploadImage.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

})();
