"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckProfile = exports.CheckState = exports.QualityKind = exports.CiceroKind = exports.OrthoKind = exports.UserPermission = void 0;
/**
 * Типы разрешений для пользователя
 */
var UserPermission;
(function (UserPermission) {
    /**
     * Пользователь имеет право работать с корпоративным словарём. Добавлять новые слова, редактировать словарь
     */
    UserPermission["USE_DICTIONARY"] = "USE_DICTIONARY";
    /**
     * Пользователю запрещено работать с вкладкой "Красота"
     * @deprecated вместо этого флага нужно пользоваться параметром `checksCicero`
     */
    UserPermission["DISABLE_CICERO"] = "DISABLE_CICERO";
    /**
     * Пользователю запрещено работать с вкладкой "Качество"
     * @deprecated вместо этого флага нужно пользоваться параметром `checksQuality`
     */
    UserPermission["DISABLE_QUALITY"] = "DISABLE_QUALITY";
    /**
     * Пользователю запрещено при работе через апи делать повторные проверки
     * @deprecated вместо этого флага нужно пользоваться параметром `checksOrtho`
     */
    UserPermission["DISABLE_API_SECONDARY_ORFO_CHECKS"] = "DISABLE_API_SECONDARY_ORFO_CHECKS";
})(UserPermission = exports.UserPermission || (exports.UserPermission = {}));
/**
 * Типы ошибок на закладке "Правописание"
 */
var OrthoKind;
(function (OrthoKind) {
    /**
     * Орфография
     */
    OrthoKind["SPELLING"] = "mkSpelling";
    /**
     * Грамматика
     */
    OrthoKind["GRAMMAR"] = "mkGrammar";
    /**
     * Пунктуация
     */
    OrthoKind["PUNCTUATION"] = "mkPunctuation";
    /**
     * Стилистика
     */
    OrthoKind["STYLE"] = "mkStyle";
    /**
     * Семантика
     */
    OrthoKind["SEMANTIC"] = "mkSemantic";
    /**
     * Типографика
     */
    OrthoKind["TYPOGRAPHY"] = "mkTypography";
    /**
     * Буква Ё
     */
    OrthoKind["YO"] = "mkYo";
    /**
     * Оформление
     */
    OrthoKind["PAPER_STRUCTURE"] = "mkPaperStructure";
})(OrthoKind = exports.OrthoKind || (exports.OrthoKind = {}));
/**
 * Типы ошибок на закладке "Красота"
 */
var CiceroKind;
(function (CiceroKind) {
    /**
     * Тавтологии
     */
    CiceroKind["TAUTOLOGY"] = "mkTautology";
    /**
     * Неблагозвучие
     */
    CiceroKind["PHONICS"] = "mkPhonics";
    /**
     * Орфоэпия
     */
    CiceroKind["ORTHOEPY"] = "mkOrthoepy";
    /**
     * Синонимы
     */
    CiceroKind["SYNONYM"] = "mkSynonym";
    /**
     * Эпитеты
     */
    CiceroKind["EPITHET"] = "mkEpithet";
    /**
     * Родная речь
     */
    CiceroKind["NATIVE_SPEECH"] = "mkNativeSpeech";
})(CiceroKind = exports.CiceroKind || (exports.CiceroKind = {}));
/**
 * Типы ошибок на закладке "Качество"
 */
var QualityKind;
(function (QualityKind) {
    /**
     * Водность
     */
    QualityKind["WATER"] = "mkWater";
})(QualityKind = exports.QualityKind || (exports.QualityKind = {}));
/**
 * Состояние проверки
 */
var CheckState;
(function (CheckState) {
    /**
     * Проверка создана
     */
    CheckState["CREATED"] = "CREATED";
    /**
     * Документ загружен на сервер
     */
    CheckState["UPLOADED"] = "UPLOADED";
    /**
     * Проверка ожидает в очереди на оценку
     */
    CheckState["WAITING_ESTIMATION"] = "WAITING_ESTIMATION";
    /**
     * Документ оценивается
     */
    CheckState["ESTIMATING"] = "ESTIMATING";
    /**
     * Оценка завершена
     */
    CheckState["ESTIMATED_SUCCESS"] = "ESTIMATED_SUCCESS";
    /**
     * Оценка завершилась с ошибкой
     */
    CheckState["ESTIMATED_ERROR"] = "ESTIMATED_ERROR";
    /**
     * В оценке отказано
     */
    CheckState["ESTIMATED_REJECT"] = "ESTIMATED_REJECT";
    /**
     * Проверка отменена
     */
    CheckState["CANCELLED"] = "CANCELLED";
    /**
     * Документ ожидает в очереди на проверку
     */
    CheckState["WAITING_CHECK"] = "WAITING_CHECK";
    /**
     * Документ проверяется
     */
    CheckState["CHECKING"] = "CHECKING";
    /**
     * В проверке отказано
     */
    CheckState["REJECTED"] = "REJECTED";
    /**
     * Проверка благополучна завершилась
     */
    CheckState["CHECKED_SUCCESS"] = "CHECKED_SUCCESS";
    /**
     * Во время проверки произошла непредвиденная ошибка
     */
    CheckState["CHECKED_ERROR"] = "CHECKED_ERROR";
})(CheckState = exports.CheckState || (exports.CheckState = {}));
var CheckProfile;
(function (CheckProfile) {
    /**
     * Проверка правописания
     */
    CheckProfile["ORTHO"] = "ortho";
    /**
     * Проверка красоты текста
     */
    CheckProfile["CICERO"] = "cicero";
    /**
     * Проверка качества текста
     */
    CheckProfile["QUALITY"] = "quality";
})(CheckProfile = exports.CheckProfile || (exports.CheckProfile = {}));
