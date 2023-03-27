# litera5-api-js-client
Клиентская библиотека API Литера 5 для JavaScript (TypeScript)

# Подключение к проекту
```bash
npm install --save orfogrammatika/litera5-api-js-client
yarn add orfogrammatika/litera5-api-js-client
```

# Использование
```javascript
var L5 = require('litera5-api-js-client');

var api = L5.createApi({company: 'my-company', secret: 'my-company-secret'});

api
  .method({param: 'param'})
  .then(function(resp){
    // обработка результатов 
  })
  .catch(function(error){
    // обработка ошибок  
  });
```

Пример подключения вынесен в [самостоятельный проек](https://github.com/orfogrammatika/litera5-api-js-client-example).

Работу библиотеки в полном объёме и во всех подробностях можно рассмотреть в [консольном клиенте для API Литеры](https://github.com/orfogrammatika/litera5-api-cli).

Так же в качестве примера использования можно рассмотреть [расширение Литеры для браузера](https://github.com/orfogrammatika/litera5-browser-extension).

Более подробное описание методов и возможностей API можно обнаружить [тут же, на гитхабе](https://github.com/orfogrammatika/litera5-api-doc).

Пример стилей для подсветки аннотаций с ошибками в тексте можно взять из примера клиента API для PHP [custom.css](https://github.com/orfogrammatika/litera5-api-php-client/blob/master/examples/custom.css)