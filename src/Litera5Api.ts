import {
	CheckOgxtRequest,
	CheckOgxtResponse,
	CheckOgxtResultsRequest,
	CheckOgxtResultsResponse,
	CheckRequest,
	CheckResponse,
	Dict,
	SetupRequest,
	SetupResponse,
	UserRequest,
	UserResponse,
} from './api-model';
import { Litera5ApiError } from './errors';
import { Signature } from './Signature';
import Logger, { ILogLevel } from 'js-logger';
import _ from 'lodash';
import fetch from 'node-fetch';

Logger.useDefaults({
	formatter: (messages, context) => {
		// Prepend the logger's name to the log message for easy identification.
		if (context.name) {
			messages.unshift(`[${context.name}]`);
		}
		if (context.level) {
			messages.unshift(`${context.level.name}`);
		}
	},
});
Logger.setLevel(Logger.INFO);

const log = Logger.get('Litera5 API');

interface Config {
	url: string;
	company: string;
	sig: Signature;
}

type Litera5ApiFields<T extends Dict> = (params: T) => any[];

export class Litera5Api {
	private readonly baseUrl: string;
	private readonly cfg: Config;

	constructor(company: string, secret: string, url?: string) {
		this.baseUrl = url ?? 'https://litera5.ru/';
		if (!this.baseUrl.endsWith('/')) {
			this.baseUrl = this.baseUrl + '/';
		}
		this.cfg = {
			url: this.baseUrl + 'api/pub/',
			company: company,
			sig: new Signature(secret),
		};

		log.debug('API настроено и готово к работе.');
	}

	private _cli<T, U>(
		method: string,
		params: T,
		requestFields: Litera5ApiFields<T>,
		responseFields: Litera5ApiFields<U>
	): Promise<U> {
		log.debug('_cli method:', method, 'params:', params);
		const now = new Date().getTime();
		const query = _.concat([now, this.cfg.company], requestFields(params));
		params = _.assign({}, params, {
			time: now,
			company: this.cfg.company,
			signature: this.cfg.sig.sign(query),
		});
		return fetch(`${this.cfg.url}${method}/`, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(params),
		})
			.then((resp: any) => {
				log.debug('raw responce:', resp);
				return resp.json() as Dict;
			})
			.then((resp: Dict) => {
				log.debug('responce:', resp);
				const query = _.concat([resp.time, responseFields(resp as U)]);
				if (this.cfg.sig.test(resp.signature, query)) {
					return resp;
				} else {
					throw new Litera5ApiError('Подпись не соответствует запросу');
				}
			})
			.then((resp: Dict) => resp as U)
			.catch((error: any) => {
				log.debug('error:', error);
				throw error;
			});
	}

	/**
	 * Настройки API Партнёра
	 *
	 * @param params
	 */
	setup(params: SetupRequest): Promise<SetupResponse> {
		return this._cli(
			'setup',
			params,
			(req: SetupRequest) => [
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
				req.hideEditorToolbar,
			],
			() => []
		);
	}

	/**
	 * Функция для создания и обновления информации о пользователях. Если пользователь
	 * с указанным логином существует в базе, то его пароль или имя будут установлены в
	 * соответствие с запросом. Если же пользователя с указанным логином не существует,
	 * то он будет создан в базе данных Сайта.
	 *
	 * @param params
	 */
	user(params: UserRequest): Promise<UserResponse> {
		return this._cli(
			'user',
			params,
			(req: UserRequest) => [
				req.login,
				req.name,
				req.password,
				req.permissions?.join(''),
				req.orthoKinds?.join(''),
				req.ciceroKinds?.join(''),
				req.qualityKinds?.join(''),
				req.checksOrtho,
				req.checksCicero,
				req.checksQuality,
				req.checksTotal,
			],
			(resp: UserResponse) => [resp.password]
		);
	}

	/**
	 * Инициирует процедуру проверки документа.
	 *
	 * @param params
	 */
	check(params: CheckRequest): Promise<CheckResponse> {
		return this._cli(
			'check',
			params,
			(req: CheckRequest) => [
				req.login,
				req.token,
				req.document,
				req.name,
				req.title,
				req.description,
				req.keywords,
				req.custom?.map(nv => `${nv.name ?? ''}${nv.value ?? ''}`).join(''),
				req.html,
			],
			(resp: CheckResponse) => [resp.document, resp.url]
		).then(resp => ({
			document: resp.document,
			url: `${this.baseUrl}${resp.url}`.replace('//', '/'),
		}));
	}

	/**
	 * Инициирует процедуру проверки документа в формате ogxt без участия пользователя.
	 *
	 * @param params
	 */
	checkOgxt(params: CheckOgxtRequest): Promise<CheckOgxtResponse> {
		return this._cli(
			'check-ogxt',
			params,
			(req: CheckOgxtRequest) => [
				req.login,
				req.profile,
				req.document,
				req.name,
				req.html,
				req.ogxt,
			],
			(resp: CheckOgxtResponse) => [resp.document, resp.check]
		);
	}

	/**
	 * Проверяет текущее состояние проверки или получает результаты проверки
	 *
	 * @param params
	 */
	checkOgxtResults(
		params: CheckOgxtResultsRequest
	): Promise<CheckOgxtResultsResponse> {
		return this._cli(
			'check-ogxt-results',
			params,
			(req: CheckOgxtResultsRequest) => [req.check],
			(resp: CheckOgxtResultsResponse) => [
				resp.state,
				resp.progress,
				resp.message,
				resp.html ?? '',
			]
		);
	}
}

export function createApi(
	company: string,
	secret: string,
	url?: string,
	level?: ILogLevel
): Litera5Api {
	if (level) {
		Logger.setLevel(level);
	}
	return new Litera5Api(company, secret, url);
}
