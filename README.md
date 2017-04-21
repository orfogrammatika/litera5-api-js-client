# litera5-api-js-client
Клиентская библиотека API Литера 5 для JavaScript

# Подключение к проекту
```bash
npm install --save github:orfogrammatika/litera5-api-js-client
```

# Использование
```javascript
var Api = require('litera5-api-js-client');

var api = new Api('my-company', 'my-secret');

api
  .method({param: 'param'})
  .then(function(resp){
    // обработка результатов 
  })
  .catch(function(error){
    // обработка ошибок  
  });
```

Реальный пример использования для проверки в Литере с самостоятельным отображением результатов можно найти в каталоге `example`.

Более подробное описание методов и возможностей API можно обнаружить на [сайте Литеры](https://litera5.ru/library/OGL/litera5.api.v1.html).

Пример стилей для подсветки аннотаций с ошибками в тексте можно взять из примера клиента API для PHP [custom.css](https://github.com/orfogrammatika/litera5-api-php-client/blob/master/examples/custom.css)