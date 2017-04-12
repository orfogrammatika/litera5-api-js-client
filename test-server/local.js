var _ = require('lodash');
var utils = require('ogxt-utils');
var Promise = require('promise-polyfill');
var Deferred = require('promise-defer');
var Logger = require('js-logger');

Logger.useDefaults();

var log = Logger.get('app');

var Api = require('../src/index');

var API_URL = 'http://localhost:8080/www/';
var API_COMPANY = 'hitsoft';
var API_SECRET = 'J5ZxT5zX1CsA6TDtyQKnWFtz9gABr3LVZWs3RhJvU3yjV1KsC5WwazjqQc0b4NHk';

var html = '<h1>Загаловак.</h1><p>Тут я написал самый гениальны текст с ашипками, каторый толька смог придумат. Вот такой вот я гиниальный пейсател.</p>';

function waitForCheckResults(check) {
	var def = new Deferred(Promise);

	function processCheckResults(resp) {
		// обрабатываем текущее состояние проверки
		switch (resp.state) {
			case Api.CheckState.CREATED:
			case Api.CheckState.UPLOADED:
			case Api.CheckState.WAITING_ESTIMATION:
			case Api.CheckState.ESTIMATING:
			case Api.CheckState.ESTIMATED_SUCCESS:
			case Api.CheckState.WAITING_CHECK:
			case Api.CheckState.CHECKING:
				// проверка ещё не завершена, ждём
				log.info('проверка', resp.progress + '%', resp.message);
				waitForResults(check);
				break;
			case Api.CheckState.ESTIMATED_ERROR:
			case Api.CheckState.ESTIMATED_REJECT:
			case Api.CheckState.CANCELLED:
			case Api.CheckState.REJECTED:
			case Api.CheckState.CHECKED_ERROR:
				// проверка не удалась
				log.error(resp.message);
				def.reject(resp.message);
				break;
			case Api.CheckState.CHECKED_SUCCESS:
				// проверка благополучно завершена
				// начиняем проверенный текст спанами показывающими ошибки
				var html = utils.annotate(resp.html, resp.annotations);
				// можно отобразить результаты
				log.info(resp.html, resp.annotations, resp.stats);
				def.resolve();
				break;
			default:
				waitForResults(check);
		}
	}

	function queryCheckResults() {
		api.checkOgxtResults({
			check: check
		}).then(processCheckResults).catch(function (error) {
			log.error(error);
			def.reject(error);
		});
	}

	function waitForResults() {
		setTimeout(queryCheckResults, 500);
	}

	waitForResults();

	return def.promise;
}

var api = new Api(API_COMPANY, API_SECRET, API_URL);

api.checkOgxt({
	login: 'root',
	profile: Api.CheckProfile.ORTHO,
	name: 'Проверка API',
	html: html,
	ogxt: utils.html2ogxt(html)
}).then(function (resp) {
	return waitForCheckResults(resp.check);
});
