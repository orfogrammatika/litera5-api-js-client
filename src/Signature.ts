import Logger from 'js-logger';
import md5 from 'md5';
import _ from 'lodash';

const log = Logger.get('Signature');

/**
 * Вспомогательный класс для вычисления и проверки подписи запросов и ответов сервера
 */
export class Signature {
	private secret: string;

	/**
	 * @param secret API_SECRET полученный при регистрации в Литере и подключении возможностей API
	 */
	constructor(secret: string) {
		this.secret = secret;
	}

	/**
	 * Склеивает параметры в строку и добавляет API_SECRET в конец всех параметров
	 * @param params
	 * @private
	 */
	_joinParams(params: any[]): string {
		const _params = _(params)
			.filter(value => !_.isNil(value))
			.map(value => {
				if (_.isArrayLikeObject(value)) {
					return _(value)
						.filter(v => !_.isNil(v))
						.join('');
				} else {
					return `${value}`;
				}
			})
			.join('');
		return _params + this.secret;
	}

	/**
	 * Функция для проверки правильности подписи
	 *
	 * @param signature подпись ответа
	 * @param params все входящие в подпись параметры кроме API_SECRET
	 */
	test(signature: string, params: any[]): boolean {
		log.debug('test signature:', signature, 'params:', params);
		return signature === this.sign(params);
	}

	/**
	 * Формирование подписи запроса
	 * @param params все входящие в подпись параметры кроме API_SECRET
	 */
	sign(params: any[]): string {
		const str = this._joinParams(params);
		const result = _.toLower(md5(str, { encoding: 'utf-8' }));
		log.debug('sign str:', str, 'result:', result);
		return result;
	}
}
