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
	UserApiPasswordRequest,
	UserApiPasswordResponse,
} from './api-model';
import { Litera5ApiError } from './errors';
import { Signature } from './Signature';
import Logger, { ILogLevel } from 'js-logger';
import _ from 'lodash';
import fetch, { Response } from 'node-fetch';

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
	userSig: Signature;
}

type Litera5ApiFields<T extends Dict> = (params: T) => any[];

function randomPassword(length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}

export interface Litera5ApiConfig {
	company: string;
	secret?: string;
	userApiPassword?: string;
	url?: string;
}

export class Litera5Api {
	private readonly baseUrl: string;
	private readonly cfg: Config;

	constructor(params: Litera5ApiConfig) {
		this.baseUrl = params.url ?? 'https://litera5.ru/';
		if (!this.baseUrl.endsWith('/')) {
			this.baseUrl = this.baseUrl + '/';
		}
		this.cfg = {
			url: this.baseUrl + 'api/pub/',
			company: params.company,
			sig: new Signature(params.secret ?? randomPassword(40)),
			userSig: new Signature(params.userApiPassword ?? randomPassword(40)),
		};

		log.debug('API настроено и готово к работе.');
	}

	private _cli<T, U>(
		sig: Signature,
		method: string,
		params: T,
		requestFields: Litera5ApiFields<T>,
		responseFields: Litera5ApiFields<U>,
	): Promise<U> {
		log.debug('_cli method:', method, 'params:', params);
		const now = new Date().getTime();
		const query = _.concat([now, this.cfg.company], requestFields(params));
		params = _.assign({}, params, {
			time: now,
			company: this.cfg.company,
			signature: sig.sign(query),
		});
		return fetch(`${this.cfg.url}${method}/`, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(params),
		})
			.then((resp: Response) => {
				log.debug('raw responce:', resp);
				if (resp.ok) {
					return resp.json() as Dict;
				} else {
					throw resp;
				}
			})
			.then((resp: Dict) => {
				log.debug('responce:', resp);
				const query = _.concat([resp.time, responseFields(resp as U)]);
				if (sig.test(resp.signature, query)) {
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
			this.cfg.sig,
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
			() => [],
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
			this.cfg.sig,
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
			(resp: UserResponse) => [resp.password],
		);
	}

	/**
	 * Функция для управления специальным паролем пользователя для работы с API.
	 *
	 * @param params
	 */
	userApiPassword(
		params: UserApiPasswordRequest,
	): Promise<UserApiPasswordResponse> {
		return this._cli(
			this.cfg.sig,
			'user-api-password',
			params,
			(req: UserApiPasswordRequest) => [req.login, req.generate],
			(resp: UserApiPasswordResponse) => [resp.password],
		);
	}

	/**
	 * Инициирует процедуру проверки документа.
	 *
	 * @param params
	 */
	check(params: CheckRequest): Promise<CheckResponse> {
		return this._cli(
			this.cfg.sig,
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
			(resp: CheckResponse) => [resp.document, resp.url],
		).then(resp => ({
			document: resp.document,
			url: `${this.baseUrl}${resp.url}`.replace('//api', '/api'),
		}));
	}

	/**
	 * Инициирует процедуру проверки документа от лица пользователя.
	 *
	 * @param params
	 */
	userCheck(params: CheckRequest): Promise<CheckResponse> {
		return this._cli(
			this.cfg.userSig,
			'user-check',
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
			(resp: CheckResponse) => [resp.document, resp.url],
		).then(resp => ({
			document: resp.document,
			url: `${this.baseUrl}${resp.url}`.replace('//api', '/api'),
		}));
	}

	/**
	 * Инициирует процедуру проверки документа в формате ogxt без участия пользователя.
	 *
	 * @param params
	 */
	checkOgxt(params: CheckOgxtRequest): Promise<CheckOgxtResponse> {
		return this._cli(
			this.cfg.sig,
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
			(resp: CheckOgxtResponse) => [resp.document, resp.check],
		);
	}

	/**
	 * Проверяет текущее состояние проверки или получает результаты проверки
	 *
	 * @param params
	 */
	checkOgxtResults(
		params: CheckOgxtResultsRequest,
	): Promise<CheckOgxtResultsResponse> {
		return this._cli(
			this.cfg.sig,
			'check-ogxt-results',
			params,
			(req: CheckOgxtResultsRequest) => [req.check],
			(resp: CheckOgxtResultsResponse) => [
				resp.state,
				resp.progress,
				resp.message,
				resp.html ?? '',
			],
		);
	}
}

export function createApi(config: Litera5ApiConfig, level?: ILogLevel): Litera5Api {
	if (level) {
		Logger.setLevel(level);
	}
	return new Litera5Api(config);
}
