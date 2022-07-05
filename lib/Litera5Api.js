"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = exports.Litera5Api = void 0;
const errors_1 = require("./errors");
const Signature_1 = require("./Signature");
const js_logger_1 = __importDefault(require("js-logger"));
const lodash_1 = __importDefault(require("lodash"));
const node_fetch_1 = __importDefault(require("node-fetch"));
js_logger_1.default.useDefaults({
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
js_logger_1.default.setLevel(js_logger_1.default.INFO);
const log = js_logger_1.default.get('Litera5 API');
function randomPassword(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
class Litera5Api {
    constructor(params) {
        var _a, _b, _c;
        this.baseUrl = (_a = params.url) !== null && _a !== void 0 ? _a : 'https://litera5.ru/';
        if (!this.baseUrl.endsWith('/')) {
            this.baseUrl = this.baseUrl + '/';
        }
        this.cfg = {
            url: this.baseUrl + 'api/pub/',
            company: params.company,
            sig: new Signature_1.Signature((_b = params.secret) !== null && _b !== void 0 ? _b : randomPassword(40)),
            userSig: new Signature_1.Signature((_c = params.userApiPassword) !== null && _c !== void 0 ? _c : randomPassword(40)),
        };
        log.debug('API настроено и готово к работе.');
    }
    _cli(sig, method, params, requestFields, responseFields) {
        log.debug('_cli method:', method, 'params:', params);
        const now = new Date().getTime();
        const query = lodash_1.default.concat([now, this.cfg.company], requestFields(params));
        params = lodash_1.default.assign({}, params, {
            time: now,
            company: this.cfg.company,
            signature: sig.sign(query),
        });
        return (0, node_fetch_1.default)(`${this.cfg.url}${method}/`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(params),
        })
            .then((resp) => {
            log.debug('raw responce:', resp);
            if (resp.ok) {
                return resp.json();
            }
            else {
                throw resp;
            }
        })
            .then((resp) => {
            log.debug('responce:', resp);
            const query = lodash_1.default.concat([resp.time, responseFields(resp)]);
            if (sig.test(resp.signature, query)) {
                return resp;
            }
            else {
                throw new errors_1.Litera5ApiError('Подпись не соответствует запросу');
            }
        })
            .then((resp) => resp)
            .catch((error) => {
            log.debug('error:', error);
            throw error;
        });
    }
    /**
     * Настройки API Партнёра
     *
     * @param params
     */
    setup(params) {
        return this._cli(this.cfg.sig, 'setup', params, (req) => [
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
        ], () => []);
    }
    /**
     * Функция для создания и обновления информации о пользователях. Если пользователь
     * с указанным логином существует в базе, то его пароль или имя будут установлены в
     * соответствие с запросом. Если же пользователя с указанным логином не существует,
     * то он будет создан в базе данных Сайта.
     *
     * @param params
     */
    user(params) {
        return this._cli(this.cfg.sig, 'user', params, (req) => {
            var _a, _b, _c, _d;
            return [
                req.login,
                req.name,
                req.password,
                (_a = req.permissions) === null || _a === void 0 ? void 0 : _a.join(''),
                (_b = req.orthoKinds) === null || _b === void 0 ? void 0 : _b.join(''),
                (_c = req.ciceroKinds) === null || _c === void 0 ? void 0 : _c.join(''),
                (_d = req.qualityKinds) === null || _d === void 0 ? void 0 : _d.join(''),
                req.checksOrtho,
                req.checksCicero,
                req.checksQuality,
                req.checksTotal,
            ];
        }, (resp) => [resp.password]);
    }
    /**
     * Функция для управления специальным паролем пользователя для работы с API.
     *
     * @param params
     */
    userApiPassword(params) {
        return this._cli(this.cfg.sig, 'user-api-password', params, (req) => [req.login, req.generate], (resp) => [resp.password]);
    }
    /**
     * Инициирует процедуру проверки документа.
     *
     * @param params
     */
    check(params) {
        return this._cli(this.cfg.sig, 'check', params, (req) => {
            var _a;
            return [
                req.login,
                req.token,
                req.document,
                req.name,
                req.title,
                req.description,
                req.keywords,
                (_a = req.custom) === null || _a === void 0 ? void 0 : _a.map(nv => { var _a, _b; return `${(_a = nv.name) !== null && _a !== void 0 ? _a : ''}${(_b = nv.value) !== null && _b !== void 0 ? _b : ''}`; }).join(''),
                req.html,
            ];
        }, (resp) => [resp.document, resp.url]).then(resp => ({
            document: resp.document,
            url: `${this.baseUrl}${resp.url}`.replace('//api', '/api'),
        }));
    }
    /**
     * Инициирует процедуру проверки документа от лица пользователя.
     *
     * @param params
     */
    userCheck(params) {
        return this._cli(this.cfg.userSig, 'user-check', params, (req) => {
            var _a;
            return [
                req.login,
                req.token,
                req.document,
                req.name,
                req.title,
                req.description,
                req.keywords,
                (_a = req.custom) === null || _a === void 0 ? void 0 : _a.map(nv => { var _a, _b; return `${(_a = nv.name) !== null && _a !== void 0 ? _a : ''}${(_b = nv.value) !== null && _b !== void 0 ? _b : ''}`; }).join(''),
                req.html,
            ];
        }, (resp) => [resp.document, resp.url]).then(resp => ({
            document: resp.document,
            url: `${this.baseUrl}${resp.url}`.replace('//api', '/api'),
        }));
    }
    /**
     * Инициирует процедуру проверки документа в формате ogxt без участия пользователя.
     *
     * @param params
     */
    checkOgxt(params) {
        return this._cli(this.cfg.sig, 'check-ogxt', params, (req) => [
            req.login,
            req.profile,
            req.document,
            req.name,
            req.html,
            req.ogxt,
        ], (resp) => [resp.document, resp.check]);
    }
    /**
     * Проверяет текущее состояние проверки или получает результаты проверки
     *
     * @param params
     */
    checkOgxtResults(params) {
        return this._cli(this.cfg.sig, 'check-ogxt-results', params, (req) => [req.check], (resp) => {
            var _a;
            return [
                resp.state,
                resp.progress,
                resp.message,
                (_a = resp.html) !== null && _a !== void 0 ? _a : '',
            ];
        });
    }
}
exports.Litera5Api = Litera5Api;
function createApi(config, level) {
    if (level) {
        js_logger_1.default.setLevel(level);
    }
    return new Litera5Api(config);
}
exports.createApi = createApi;
