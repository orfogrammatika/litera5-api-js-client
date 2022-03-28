"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const js_logger_1 = __importDefault(require("js-logger"));
const md5_1 = __importDefault(require("md5"));
const lodash_1 = __importDefault(require("lodash"));
const log = js_logger_1.default.get('Signature');
/**
 * Вспомогательный класс для вычисления и проверки подписи запросов и ответов сервера
 */
class Signature {
    /**
     * @param secret API_SECRET полученный при регистрации в Литере и подключении возможностей API
     */
    constructor(secret) {
        this.secret = secret;
    }
    /**
     * Склеивает параметры в строку и добавляет API_SECRET в конец всех параметров
     * @param params
     * @private
     */
    _joinParams(params) {
        const _params = (0, lodash_1.default)(params)
            .filter(value => !lodash_1.default.isNil(value))
            .map(value => {
            if (lodash_1.default.isArrayLikeObject(value)) {
                return (0, lodash_1.default)(value)
                    .filter(v => !lodash_1.default.isNil(v))
                    .join('');
            }
            else {
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
    test(signature, params) {
        log.debug('test signature:', signature, 'params:', params);
        return signature === this.sign(params);
    }
    /**
     * Формирование подписи запроса
     * @param params все входящие в подпись параметры кроме API_SECRET
     */
    sign(params) {
        const str = this._joinParams(params);
        const result = lodash_1.default.toLower((0, md5_1.default)(str, { encoding: 'utf-8' }));
        log.debug('sign str:', str, 'result:', result);
        return result;
    }
}
exports.Signature = Signature;
