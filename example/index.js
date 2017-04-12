var Api = require('litera5-api-js-client');
var utils = require('ogxt-utils');

// инициализируем API идентификатором компании и секретным ключом
var api = new Api('my-company', 'my-secret');

/**
 * Ожидание результатов проверки
 */
function waitForResults(check) {
	setTimeout(function () {
		// обращаемся к серверу за данными
		api.checkOgxtResults({
			check: check
		}).then(function (resp) {
			// обрабатываем текущее состояние проверки
			switch (resp.progress.state) {
				case Api.CheckState.CREATED:
				case Api.CheckState.UPLOADED:
				case Api.CheckState.WAITING_ESTIMATION:
				case Api.CheckState.ESTIMATING:
				case Api.CheckState.ESTIMATED_SUCCESS:
				case Api.CheckState.WAITING_CHECK:
				case Api.CheckState.CHECKING:
					// проверка ещё не завершена, ждём
					console.log('проверка', resp.progress.perc + '%', resp.progress.text);
					waitForResults(check);
					break;
				case Api.CheckState.ESTIMATED_ERROR:
				case Api.CheckState.ESTIMATED_REJECT:
				case Api.CheckState.CANCELLED:
				case Api.CheckState.REJECTED:
				case Api.CheckState.CHECKED_ERROR:
					// проверка не удалась
					console.error(resp.progress.text);
					break;
				case Api.CheckState.CHECKED_SUCCESS:
					// проверка благополучно завершена
					// начиняем проверенный текст спанами показывающими ошибки
					var html = utils.annotate(resp.html, resp.annotations);
					// можно отобразить результаты
					console.log(resp.html, resp.annotations, resp.stats);
					break;
				default:
					waitForResults(check);
			}
		}).catch(function (error) {
			console.error(error);
		});
	}, 1000);
}

var src = '<h1>Загаловак.</h1><p>Текст с ашипками</p>';
var html = utils.cleanupHtml(src, true);
var ogxt = utils.html2ogxt(html);

// запускаем проверку текста
api.checkOgxt({
	login: 'user', // логин пользователя в Литере
	document: '0234087029834', // идентификатор документа в Литере, если это не первичная проверка
	name: utils.parseTitle(ogxt), // название документа (можно опустить, тогда он будет сформирован по такому же принципу)
	html: html, // исходный текст документа почищеный от аннотаций, скриптов и прочих пустых спанов
	ogxt: ogxt // текст документа сконвертированный в формат для проверки
}).then(function (resp) {
	waitForResults(resp.check);
}).catch(function (error) {
	console.error(error);
});
