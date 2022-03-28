/**
 * Типы разрешений для пользователя
 */
export enum UserPermission {
	/**
	 * Пользователь имеет право работать с корпоративным словарём. Добавлять новые слова, редактировать словарь
	 */
	USE_DICTIONARY = 'USE_DICTIONARY',
	/**
	 * Пользователю запрещено работать с вкладкой "Красота"
	 * @deprecated вместо этого флага нужно пользоваться параметром `checksCicero`
	 */
	DISABLE_CICERO = 'DISABLE_CICERO',
	/**
	 * Пользователю запрещено работать с вкладкой "Качество"
	 * @deprecated вместо этого флага нужно пользоваться параметром `checksQuality`
	 */
	DISABLE_QUALITY = 'DISABLE_QUALITY',
	/**
	 * Пользователю запрещено при работе через апи делать повторные проверки
	 * @deprecated вместо этого флага нужно пользоваться параметром `checksOrtho`
	 */
	DISABLE_API_SECONDARY_ORFO_CHECKS = 'DISABLE_API_SECONDARY_ORFO_CHECKS',
}

/**
 * Типы ошибок на закладке "Правописание"
 */
export enum OrthoKind {
	/**
	 * Орфография
	 */
	SPELLING = 'mkSpelling',
	/**
	 * Грамматика
	 */
	GRAMMAR = 'mkGrammar',
	/**
	 * Пунктуация
	 */
	PUNCTUATION = 'mkPunctuation',
	/**
	 * Стилистика
	 */
	STYLE = 'mkStyle',
	/**
	 * Семантика
	 */
	SEMANTIC = 'mkSemantic',
	/**
	 * Типографика
	 */
	TYPOGRAPHY = 'mkTypography',
	/**
	 * Буква Ё
	 */
	YO = 'mkYo',
	/**
	 * Оформление
	 */
	PAPER_STRUCTURE = 'mkPaperStructure',
}

/**
 * Типы ошибок на закладке "Красота"
 */
export enum CiceroKind {
	/**
	 * Тавтологии
	 */
	TAUTOLOGY = 'mkTautology',
	/**
	 * Неблагозвучие
	 */
	PHONICS = 'mkPhonics',
	/**
	 * Орфоэпия
	 */
	ORTHOEPY = 'mkOrthoepy',
	/**
	 * Синонимы
	 */
	SYNONYM = 'mkSynonym',
	/**
	 * Эпитеты
	 */
	EPITHET = 'mkEpithet',
	/**
	 * Родная речь
	 */
	NATIVE_SPEECH = 'mkNativeSpeech',
}

/**
 * Типы ошибок на закладке "Качество"
 */
export enum QualityKind {
	/**
	 * Водность
	 */
	WATER = 'mkWater',
}

/**
 * Состояние проверки
 */
export enum CheckState {
	/**
	 * Проверка создана
	 */
	CREATED = 'CREATED',
	/**
	 * Документ загружен на сервер
	 */
	UPLOADED = 'UPLOADED',
	/**
	 * Проверка ожидает в очереди на оценку
	 */
	WAITING_ESTIMATION = 'WAITING_ESTIMATION',
	/**
	 * Документ оценивается
	 */
	ESTIMATING = 'ESTIMATING',
	/**
	 * Оценка завершена
	 */
	ESTIMATED_SUCCESS = 'ESTIMATED_SUCCESS',
	/**
	 * Оценка завершилась с ошибкой
	 */
	ESTIMATED_ERROR = 'ESTIMATED_ERROR',
	/**
	 * В оценке отказано
	 */
	ESTIMATED_REJECT = 'ESTIMATED_REJECT',
	/**
	 * Проверка отменена
	 */
	CANCELLED = 'CANCELLED',
	/**
	 * Документ ожидает в очереди на проверку
	 */
	WAITING_CHECK = 'WAITING_CHECK',
	/**
	 * Документ проверяется
	 */
	CHECKING = 'CHECKING',
	/**
	 * В проверке отказано
	 */
	REJECTED = 'REJECTED',
	/**
	 * Проверка благополучна завершилась
	 */
	CHECKED_SUCCESS = 'CHECKED_SUCCESS',
	/**
	 * Во время проверки произошла непредвиденная ошибка
	 */
	CHECKED_ERROR = 'CHECKED_ERROR',
}

export enum CheckProfile {
	/**
	 * Проверка правописания
	 */
	ORTHO = 'ortho',
	/**
	 * Проверка красоты текста
	 */
	CICERO = 'cicero',
	/**
	 * Проверка качества текста
	 */
	QUALITY = 'quality',
}
