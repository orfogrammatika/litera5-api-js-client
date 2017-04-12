var md5 = require('md5');
var _ = require('lodash');

/**
 * Вспомогательный класс для вычисления и проверки подписи запросов и ответов сервера
 * @constructor
 * @param secret API_SECRET полученный при регистрации в Литере и подключении возможностей API
 */
module.exports = function (/**string*/secret) {

	function _join(params) {
		return _(params)
			.filter(function (value) {
				return !_.isNil(value);
			})
			.map(function (value) {
				if (_.isArrayLikeObject(value)) {
					return _(value).filter().join('');
				} else {
					return value.toString();
				}
			})
			.join('');
	}

	/**
	 * Склеивает параметры в строку и добавляет API_SECRET в конец всех параметров
	 * @returns {string}
	 * @private
	 */
	this._joinParams = function (/**Array*/params) {
		return _join(params) + secret;
	};

	/**
	 * Функция для проверки правильности подписи
	 * Первый параметр — это подпись (signature), остальные — это все входящие в подпись параметры кроме API_SECRET
	 */
	this.test = function (/**string*/signature, /**Array*/params) {
		return signature === this.sign(params);
	};

	/**
	 * Вычисление подписи запроса
	 * Параметры — это все входящие в запрос параметры кроме API_SECRET
	 */
	this.sign = function (/**Array*/params) {
		var str = this._joinParams(params);
		return _.toLower(md5(str));
	};
};
