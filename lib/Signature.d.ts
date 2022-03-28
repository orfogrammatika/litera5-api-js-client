/**
 * Вспомогательный класс для вычисления и проверки подписи запросов и ответов сервера
 */
export declare class Signature {
    private secret;
    /**
     * @param secret API_SECRET полученный при регистрации в Литере и подключении возможностей API
     */
    constructor(secret: string);
    /**
     * Склеивает параметры в строку и добавляет API_SECRET в конец всех параметров
     * @param params
     * @private
     */
    _joinParams(params: any[]): string;
    /**
     * Функция для проверки правильности подписи
     *
     * @param signature подпись ответа
     * @param params все входящие в подпись параметры кроме API_SECRET
     */
    test(signature: string, params: any[]): boolean;
    /**
     * Формирование подписи запроса
     * @param params все входящие в подпись параметры кроме API_SECRET
     */
    sign(params: any[]): string;
}
