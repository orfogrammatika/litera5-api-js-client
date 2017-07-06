var Logger = require('js-logger');
var Promise = require('promise-polyfill');
var _ = require('lodash');
var agent = require('superagent-promise')(require('superagent'), Promise);

var Signature = require('./Signature');

var log = Logger.get('Litera5 API');

function Litera5ApiError(message, error) {
	this.name = 'Litera5ApiError';
	this.message = message || '';
	this.cause = error;
}
Litera5ApiError.prototype = Error.prototype;

function _now() {
	return (new Date()).getTime();
}

function _cli(cli, method, params, requestFields, responseFields) {
	log.debug('_cli method:', method, 'params:', params);
	var now = _now();
	var query = _.concat([now, cli.company], requestFields(params));
	params = _.assign({}, params, {
		time: now,
		company: cli.company,
		signature: cli.sig.sign(query)
	});

	return agent
		.post(cli.url + method + '/')
		.send(params)
		.set('Accept', 'application/json')
		.end()
		.then(function (resp) {
			resp = resp.body;
			var query = _.concat([resp.time], responseFields(resp));
			if (cli.sig.test(resp.signature, query)) {
				return Promise.resolve(resp);
			} else {
				throw new Litera5ApiError('Подпись не соответствует запросу', resp);
			}
		})
		.catch(function (error) {
			throw new Litera5ApiError('Непредвиденная ошибка API', error);
		});
}

function _cliUrl(cli, method, params) {
	log.debug('_cliUrl method:', method, 'params:', params);
	return cli.url + method + '/' + params.oneOffId + '/';
}

function Litera5Api(/**string*/company, /**string*/secret, /**string*/url) {
	url = url || 'https://litera5.ru/';
	if (!url.endsWith('/'))
		url = url + '/';
	this.cli = {
		url: url + 'api/pub/',
		company: company,
		sig: new Signature(secret)
	};
	log.debug('API настроено и готово к работе.');
}
/**
 * Типы разрешений для пользователя
 */
Litera5Api.UserPermission = {
	/**
	 * Пользователь имеет право работать с корпоративным словарём. Добавлять новые слова, редактировать словарь
	 */
	USE_DICTIONARY: 'USE_DICTIONARY',
	/**
	 * Пользователю запрещено работать с "Синомимами/Эпитетами"
	 */
	DISABLE_CICERO: 'DISABLE_CICERO',
	/**
	 * Пользователю запрещено при работе через апи делать повторные проверки
	 */
	DISABLE_API_SECONDARY_ORFO_CHECKS: 'DISABLE_API_SECONDARY_ORFO_CHECKS'
};
/**
 * Типы ошибок на закладке "Правописание"
 */
Litera5Api.OrthoKind = {
	/**
	 * Орфография
	 */
	SPELLING: 'mkSpelling',
	/**
	 * Грамматика
	 */
	GRAMMAR: 'mkGrammar',
	/**
	 * Пунктуация
	 */
	PUNCTUATION: 'mkPunctuation',
	/**
	 * Стилистика
	 */
	STYLE: 'mkStyle',
	/**
	 * Семантика
	 */
	SEMANTIC: 'mkSemantic',
	/**
	 * Типографика
	 */
	TYPOGRAPHY: 'mkTypography',
	/**
	 * Буква Ё
	 */
	YO: 'mkYo',
	/**
	 * Оформление
	 */
	PAPER_STRUCTURE: 'mkPaperStructure'
};

/**
 * Типы ошибок на закладке "Синонимы/эпитеты"
 */
Litera5Api.CiceroKind = {
	/**
	 * Тавтологии
	 */
	TAUTOLOGY: 'mkTautology',
	/**
	 * Неблагозвучие
	 */
	PHONICS: 'mkPhonics',
	/**
	 * Орфоэпия
	 */
	ORTHOEPY: 'mkOrthoepy',
	/**
	 * Синонимы
	 */
	SYNONYM: 'mkSynonym',
	/**
	 * Эпитеты
	 */
	EPITHET: 'mkEpithet',
	/**
	 * Родная речь
	 */
	NATIVE_SPEECH: 'mkNativeSpeech'
};
/**
 * Настройки API Партнёра
 *
 * @param {{
   *   onSaveCorrected: string,
   *   onIFrameFailure: string,
   *   onInitialStats: string,
   *   returnIcon: string,
   *   returnCaption: string,
   *   cancelIcon: string,
   *   cancelCaption: string,
   *   allowResizeImages: boolean,
   *   showCancelButton: boolean,
   *   editorCss: string,
   *   getStats: boolean,
   *   hideEditorToolbar: boolean,
   * }} params — параметры запроса
 * @returns Promise
 */
Litera5Api.prototype.setup = function (params) {
	return _cli(this.cli, 'setup', params, function (req) {
		return [
			req.onSaveCorrected,
			req.onIFrameFailure,
			req.onInitialStats,
			req.returnIcon,
			req.returnCaption,
			req.cancelIcon,
			req.cancelCaption,
			req.allowResizeImages,
			req.showCancelButton,
			req.editorCss,
			req.getStats,
			req.hideEditorToolbar
		];
	}, function (resp) {
		return [];
	});
};
/**
 * Функция для создания и обновления информации о пользователях. Если пользователь
 * с указанным логином существует в базе, то его пароль или имя будут установлены в
 * соответствие с запросом. Если же пользователя с указанным логином не существует,
 * то он будет создан в базе данных Сайта.
 *
 * @param {{
   * 	 login: string,
   * 	 name: string,
   * 	 password: string,
   * 	 permissions: Array.<Litera5Api.UserPermission>,
   * 	 orthoKinds: Array.<Litera5Api.OrthoKind>,
   * 	 ciceroKinds: Array.<Litera5Api.CiceroKind>
   * }} params
 * @returns Promise
 */
Litera5Api.prototype.user = function (params) {
	return _cli(this.cli, 'user', params, function (req) {
		return [
			req.login,
			req.name,
			req.password,
			req.permissions,
			req.orthoKinds,
			req.ciceroKinds
		];
	}, function (resp) {
		return [
			resp.password
		];
	});
};
/**
 * Инициирует процедуру проверки документа.
 * @param {{
	 * 	 login: string,
	 * 	 token: string,
	 * 	 document: string,
	 * 	 name: string,
	 * 	 title: string,
	 * 	 description: string,
	 * 	 keywords: string,
	 * 	 custom: Array.<{name: string, value: string}>,
	 * 	 html: string
	 * }} params
 * @returns Promise
 */
Litera5Api.prototype.check = function (params) {
	return _cli(this.cli, 'check', params, function (req) {
		return [
			req.login,
			req.token,
			req.document,
			req.name,
			req.title,
			req.description,
			req.keywords,
			_.map(req.custom, function (nv) {
				return '' + (_.isNil(nv.name) ? '' : nv.name) + (_.isNil(nv.value) ? '' : nv.value);
			}),
			req.html
		];
	}, function (resp) {
		return [
			resp.document,
			resp.url
		];
	});
};
Litera5Api.CheckProfile = {
	/**
	 * Проверка правописания
	 */
	ORTHO: 'ortho',
	/**
	 * Проверка красоты текста
	 */
	CICERO: 'cicero'
};
/**
 * Инициирует процедуру проверки документа в формате ogxt без участия пользователя.
 * @param {{
	 *    login: string,
	 *    profile: Litera5Api.CheckProfile,
	 *    document: string,
	 *    name: string,
	 *    html: string,
	 *    ogxt: string
	 * }} params
 * @returns Promise
 */
Litera5Api.prototype.checkOgxt = function (params) {
	return _cli(this.cli, 'check-ogxt', params, function (req) {
		return [
			req.login,
			req.profile,
			req.document,
			req.name,
			req.html,
			req.ogxt
		];
	}, function (resp) {
		return [
			resp.document,
			resp.check
		];
	});
};
/**
 * Состояние проверки
 */
Litera5Api.CheckState = {
	/**
	 * Проверка создана
	 */
	CREATED: 'CREATED',
	/**
	 * Документ загружен на сервер
	 */
	UPLOADED: 'UPLOADED',
	/**
	 * Проверка ожидает в очереди на оценку
	 */
	WAITING_ESTIMATION: 'WAITING_ESTIMATION',
	/**
	 * Документ оценивается
	 */
	ESTIMATING: 'ESTIMATING',
	/**
	 * Оценка завершена
	 */
	ESTIMATED_SUCCESS: 'ESTIMATED_SUCCESS',
	/**
	 * Оценка завершилась с ошибкой
	 */
	ESTIMATED_ERROR: 'ESTIMATED_ERROR',
	/**
	 * В оценке отказано
	 */
	ESTIMATED_REJECT: 'ESTIMATED_REJECT',
	/**
	 * Проверка отменена
	 */
	CANCELLED: 'CANCELLED',
	/**
	 * Документ ожидает в очереди на проверку
	 */
	WAITING_CHECK: 'WAITING_CHECK',
	/**
	 * Документ проверяется
	 */
	CHECKING: 'CHECKING',
	/**
	 * В проверке отказано
	 */
	REJECTED: 'REJECTED',
	/**
	 * Проверка благополучна завершилась
	 */
	CHECKED_SUCCESS: 'CHECKED_SUCCESS',
	/**
	 * Во время проверки произошла непредвиденная ошибка
	 */
	CHECKED_ERROR: 'CHECKED_ERROR'
};
/**
 * Проверяет текущее состояние проверки или получает результаты проверки
 * @param {{
	 *   check: string
	 * }} params
 * @returns Promise
 */
Litera5Api.prototype.checkOgxtResults = function (params) {
	return _cli(this.cli, 'check-ogxt-results', params, function (req) {
		return [
			req.check
		];
	}, function (resp) {
		return [
			resp.state,
			resp.progress,
			resp.message,
			resp.html
		];
	});
};
/**
 * Одноразовая ссылка редактора документа с возможностью проверки и корректировки, с которым могут
 * работать Пользователи. Инструмент содержит в себе кнопку "Вернуться в CMS" при нажатии на
 * которую работа с документом на Сайте будет прекращена, а текущая версия документа передана
 * для дальнейшей обработки в CMS Партнёра.
 *
 * @param {string} oneOffId
 * @returns Promise
 */
Litera5Api.prototype.iframeUrl = function (oneOffId) {
	return _cliUrl(this.cli, 'iframe', {
		oneOffId: oneOffId
	});
};

module.exports = Litera5Api;
