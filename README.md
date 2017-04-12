# litera5-api-js-client
Клиентская библиотека API Литера 5 для JavaScript

# Подключение к проекту
```bash
npm install --save hitsoft/litera5-api-js-client
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

Реальный пример использования для проверки в Литере с самостоятельным отображением результатов можно найти в каталоге `example`

# Отладка