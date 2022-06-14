import { CheckOgxtRequest, CheckOgxtResponse, CheckOgxtResultsRequest, CheckOgxtResultsResponse, CheckRequest, CheckResponse, SetupRequest, SetupResponse, UserRequest, UserResponse, UserApiPasswordRequest, UserApiPasswordResponse } from './api-model';
import { ILogLevel } from 'js-logger';
export declare class Litera5Api {
    private readonly baseUrl;
    private readonly cfg;
    constructor(company: string, secret: string, url?: string);
    private _cli;
    /**
     * Настройки API Партнёра
     *
     * @param params
     */
    setup(params: SetupRequest): Promise<SetupResponse>;
    /**
     * Функция для создания и обновления информации о пользователях. Если пользователь
     * с указанным логином существует в базе, то его пароль или имя будут установлены в
     * соответствие с запросом. Если же пользователя с указанным логином не существует,
     * то он будет создан в базе данных Сайта.
     *
     * @param params
     */
    user(params: UserRequest): Promise<UserResponse>;
    /**
     * Функция для управления специальным паролем пользователя для работы с API.
     *
     * @param params
     */
    userApiPassword(params: UserApiPasswordRequest): Promise<UserApiPasswordResponse>;
    /**
     * Инициирует процедуру проверки документа.
     *
     * @param params
     */
    check(params: CheckRequest): Promise<CheckResponse>;
    /**
     * Инициирует процедуру проверки документа в формате ogxt без участия пользователя.
     *
     * @param params
     */
    checkOgxt(params: CheckOgxtRequest): Promise<CheckOgxtResponse>;
    /**
     * Проверяет текущее состояние проверки или получает результаты проверки
     *
     * @param params
     */
    checkOgxtResults(params: CheckOgxtResultsRequest): Promise<CheckOgxtResultsResponse>;
}
export declare function createApi(company: string, secret: string, url?: string, level?: ILogLevel): Litera5Api;
