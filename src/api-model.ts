import {
	CheckProfile,
	CheckState,
	CiceroKind,
	OrthoKind,
	QualityKind,
	UserPermission,
} from './enums';
import { CheckResults, CheckStats } from './report-model';

export interface Dict {
	[key: string]: any;
}

export interface SetupRequest extends Dict {
	/**
	 * URL в CMS Партнёра , на который будет отправлен запрос по окончании работы Пользователя с документом.
	 * Так как ответ будет передан запросом POST, то ` onSaveCorrected ` не должен содержать параметров в
	 * формате "?param=value&param1=value".
	 */
	onSaveCorrected?: string;
	/**
	 * URL в CMS Партнёра, на который будет отправлен запрос в случае критической ошибки.
	 * Так как ответ будет передан запросом POST, то `onIFrameFailure` не должен содержать параметров в
	 * формате "?param=value&param1=value".
	 */
	onIFrameFailure?: string;
	/**
	 * URL в CMS Партнёра , на который будет отправлен запрос со статистикой по окончании первичной проверки
	 * документа пользователя. Так как ответ будет передан запросом POST, то ` onInitialStats ` не должен содержать
	 * параметров в формате "?param=value&param1=value".
	 */
	onInitialStats?: string;
	/**
	 * URL картинки размером 32х32, которая будет размещена на кнопке "Сохранить правки и вернуться в CMS".
	 * Например логотип компании Партнёра.
	 */
	returnIcon?: string;
	/**
	 * Подпись для кнопки "Сохранить правки и вернуться в CMS".
	 */
	returnCaption?: string;
	/**
	 * URL картинки размером 32х32, которая будет размещена на кнопке "Отменить правки и вернуться в CMS".
	 */
	cancelIcon?: string;
	/**
	 * Подпись для кнопки "Отменить правки и вернуться в CMS".
	 */
	cancelCaption?: string;
	/**
	 * Тип логический (boolean), true или false, по умолчанию настройка включена. Если настройка включена, то в
	 * редакторе можно изменять размер встроенных картинок.
	 */
	allowResizeImages?: boolean;
	/**
	 * Тип логический (boolean), true или false, по умолчанию выключена. Если настройка включена, то в редакторе
	 * появляется кнопка " Отменить правки и вернуться в CMS ", при нажатии на которую в CMS будет отправлен пустой
	 * запрос `on-save-corrected` (без указания параметра html). Это означает, что пользователь не хочет сохранять
	 * сделанные изменения.
	 */
	showCancelButton?: boolean;
	/**
	 * Полный путь до файла стилей для редактора. (исходники SCSS тем стилей, которые можно взять за основу
	 * можно найти на Githab)
	 */
	editorCss?: string;
	/**
	 * Тип логический (boolean), true или false, по умолчанию настройка выключена. Если настройка включена, то в модели
	 * результата для onSaveCorrected вместе с обработанным текстом будет модель статистического отчёта в формате JSON.
	 */
	getStats?: boolean;
	/**
	 * Тип логический (boolean), true или false, по умолчанию выключена. Если настройка включена, то в редакторе при
	 * работе через API тулбар будет пустым.
	 */
	hideEditorToolbar?: boolean;
}

export interface SetupResponse extends Dict {
	/**
	 * URL в CMS Партнёра , на который будет отправлен запрос по окончании работы Пользователя с документом.
	 * Так как ответ будет передан запросом POST, то ` onSaveCorrected ` не должен содержать параметров в
	 * формате "?param=value&param1=value".
	 */
	onSaveCorrected: string;
	/**
	 * URL в CMS Партнёра, на который будет отправлен запрос в случае критической ошибки.
	 * Так как ответ будет передан запросом POST, то `onIFrameFailure` не должен содержать параметров в
	 * формате "?param=value&param1=value".
	 */
	onIFrameFailure: string;
	/**
	 * URL в CMS Партнёра , на который будет отправлен запрос со статистикой по окончании первичной проверки
	 * документа пользователя. Так как ответ будет передан запросом POST, то ` onInitialStats ` не должен содержать
	 * параметров в формате "?param=value&param1=value".
	 */
	onInitialStats: string;
	/**
	 * URL картинки размером 32х32, которая будет размещена на кнопке "Сохранить правки и вернуться в CMS".
	 * Например логотип компании Партнёра.
	 */
	returnIcon: string;
	/**
	 * Подпись для кнопки "Сохранить правки и вернуться в CMS".
	 */
	returnCaption: string;
	/**
	 * URL картинки размером 32х32, которая будет размещена на кнопке "Отменить правки и вернуться в CMS".
	 */
	cancelIcon: string;
	/**
	 * Подпись для кнопки "Отменить правки и вернуться в CMS".
	 */
	cancelCaption: string;
	/**
	 * Тип логический (boolean), true или false, по умолчанию настройка включена. Если настройка включена, то в
	 * редакторе можно изменять размер встроенных картинок.
	 */
	allowResizeImages: boolean;
	/**
	 * Тип логический (boolean), true или false, по умолчанию выключена. Если настройка включена, то в редакторе
	 * появляется кнопка " Отменить правки и вернуться в CMS ", при нажатии на которую в CMS будет отправлен пустой
	 * запрос `on-save-corrected` (без указания параметра html). Это означает, что пользователь не хочет сохранять
	 * сделанные изменения.
	 */
	showCancelButton: boolean;
	/**
	 * Полный путь до файла стилей для редактора. (исходники SCSS тем стилей, которые можно взять за основу
	 * можно найти на Githab)
	 */
	editorCss: string;
	/**
	 * Тип логический (boolean), true или false, по умолчанию настройка выключена. Если настройка включена, то в модели
	 * результата для onSaveCorrected вместе с обработанным текстом будет модель статистического отчёта в формате JSON.
	 */
	getStats: boolean;
	/**
	 * Тип логический (boolean), true или false, по умолчанию выключена. Если настройка включена, то в редакторе при
	 * работе через API тулбар будет пустым.
	 */
	hideEditorToolbar: boolean;
}

export interface UserRequest extends Dict {
	/**
	 * Идентификатор пользователя на Сайте. Логин пользователя на Сайте формируется из полей `login` и `company` по
	 * формуле "login@company". Идентификатор пользователя не может быть пустым и должен состоять из строчных
	 * (маленьких) букв английского алфавита, цифр или знака точки.
	 */
	login: string;
	/**
	 * Имя которое будет выводиться в кабинете пользователя и в отчётах. Если не указано для нового пользователя, то
	 * будет использован `login`.
	 */
	name?: string;
	/**
	 * Пароль для нового пользователя, или при необходимости его сменить. Если пароль для нового пользователя не указан,
	 * он будет сгенерирован автоматически.
	 */
	password?: string;
	/**
	 * Список разрешений для пользователя. Для вычисления signature все значения собираются в строчку без каких либо
	 * разделителей. Если при создании пользователя никаких разрешений не указано, то считается, что пользователь
	 * создаётся с разрешениями по умолчанию, а именно: ["USE_DICTIONARY "]. Если необходимо создать пользователя,
	 * которому не разрешено работать со словарём, то необходимо передать пустой список разрешений: [].
	 */
	permissions?: UserPermission[];
	/**
	 * Список типов аннотаций правописания, которые нужно показывать пользователю после проверки. Пустой список означает,
	 * что пользователю нужно будет выбирать их каждый раз после проверки документа.
	 */
	orthoKinds?: OrthoKind[];
	/**
	 * Список типов аннотаций алгоритма «Цицерон», которые нужно показывать пользователю после проверки. Пустой список
	 * означает, что пользователю нужно будет выбирать их каждый раз после проверки документа.
	 */
	ciceroKinds?: CiceroKind[];
	/**
	 * Список типов аннотаций вкладки «Качество», которые нужно показывать пользователю после проверки. Пустой список
	 * означает, что пользователю нужно будет выбирать их каждый раз после проверки документа.
	 */
	qualityKinds?: QualityKind[];
	/**
	 * Максимальное количество проверок грамотности (не может быть 0, минимальное значение 1, первая проверка
	 * запускается автоматически). -1 означает, что можно делать сколько угодно проверок. По умолчанию -1 (сколько
	 * угодно проверок).
	 */
	checksOrtho?: number;
	/**
	 * Максимальное количество проверок красоты. -1 означает, что можно делать сколько угодно проверок. 0 означает, что
	 * вкладки "Красота" не будет вовсе. По умолчанию -1 (сколько угодно проверок).
	 */
	checksCicero?: number;
	/**
	 * Максимальное количество проверок качества. -1 означает, что можно делать сколько угодно проверок. 0 означает,
	 * что вкладки "Качество" не будет вовсе. По умолчанию -1 (сколько угодно проверок).
	 */
	checksQuality?: number;
	/**
	 * Максимальное количество проверок суммарно для всех вкладок. -1 означает, что можно делать сколько угодно проверок.
	 * По умолчанию -1 (сколько угодно проверок). Если задано ограничение checksTotal, например: 10, то когда
	 * пользователь выполнит десятую проверку, во всех вкладках у него исчезнут кнопки "Проверить...", и одиннадцатую
	 * проверку он выполнить не сможет ни в одной из вкладок, даже если для каждой конкретной вкладки вы не задавали
	 * ограничений.
	 */
	checksTotal?: number;
}

export interface UserResponse extends Dict {
	/**
	 * Сгенерированный пароль для нового пользователя, если он был создан в ходе запроса.
	 */
	password?: string;
}

export interface UserApiPasswordRequest extends Dict {
	/**
	 * Идентификатор пользователя на Сайте. Логин пользователя на Сайте формируется из полей `login` и `company` по
	 * формуле "login@company". Идентификатор пользователя не может быть пустым и должен состоять из строчных
	 * (маленьких) букв английского алфавита, цифр или знака точки.
	 */
	login: string;
	/**
	 * Если `true`, то создать новый пароль заместив собой существующий.
	 */
	generate?: boolean;
}

export interface UserApiPasswordResponse extends Dict {
	/**
	 * Свежесгенерированный пароль пользователя для работы с API (если в запросе указан параметр `generate`) или
	 * текущий параметр.
	 */
	password?: string;
}

export interface NameValue {
	/**
	 * Название произвольного поля
	 */
	name: string;
	/**
	 * html для проверки
	 */
	value: string;
}

export interface CheckRequest extends Dict {
	/**
	 * Логин пользователя на Сайте, который работает с документом.
	 */
	login: string;
	/**
	 * Параметр содержащий закодированную информацию о том, какой именно документ и для какого пользователя возвращается
	 * в запросе по `SetupRequest.onSaveCorrected`. Это может быть информация закодированная в строку, например
	 * "${userId}-${documentId}" или же можно в базе данных создать запись с детальными параметрами, а сюда передать
	 * только номер записи. В любом случае по этому параметру должно быть возможно определить куда девать результирующий
	 * текст.
	 */
	token: string;
	/**
	 * Идентификатор документа в системе Сайта. Если указан, то будет продолжена работа над тем же самым документом,
	 * если нет, то будет создан новый документ. Пожалуйста, обратите внимание на то обстоятельство, что в данный момент
	 * в Литере5 с документом может работать только один пользователь. Поэтому несмотря на то, что в CMS с документом
	 * могут работать различные пользователи, при работе с одним и тем же документом в API имеет смысл передавать в
	 * `login` не идентификатор текущего пользователя CMS Партнёра, а идентификатор пользователя создавшего данный
	 * документ в Литере5 (того пользователя в результате проверки которого был выдан этот `document`). В противном
	 * случае API выдаст ошибку о недостатке прав пользователя на работу с документом.
	 */
	document?: string;
	/**
	 * Название документа (title, subject). Если не указано, то будет сформировано автоматически из текста.
	 */
	name?: string;
	/**
	 * Дополнительное поле. Заголовок документа для проверки. Дополнительные поля будут добавлены в специальную форму
	 * для дополнительной проверки.
	 */
	title?: string;
	/**
	 * Дополнительное поле. Краткое описание страницы для проверки.
	 */
	description?: string;
	/**
	 * Дополнительное поле. Ключевые слова страницы для проверки.
	 */
	keywords?: string;
	/**
	 * Список дополнительных произвольных полей для проверки. Каждый элемент списка – это объект с атрибутами: name,
	 * value. name – это название произвольного поля, value – это html для проверки.
	 */
	custom?: NameValue[];
	/**
	 * Собственно текст для проверки в формате html. Если указан `document`, и не указан `html`, тогда откроется
	 * редактор с последней версией документа сохранённого на Сайте. Если текст указан, то он заместит собой текст
	 * выбранного `document` или инициирует процесс создания нового документа. Либо `documentId` либо `html` должно
	 * быть обязательно указано.
	 */
	html?: string;
}

export interface CheckResponse extends Dict {
	/**
	 * Идентификатор документа в системе Сайта созданный в результате запроса.
	 */
	document: string;
	/**
	 * Одноразовая ссылка на Сайт редактор документа переданного в запросе, которую можно открывать в новом окне, или в
	 * IFRAME в CMS Партнёра.
	 */
	url: string;
}

export interface CheckOgxtRequest extends Dict {
	/**
	 * Логин пользователя на Сайте, который работает с документом.
	 */
	login: string;
	/**
	 * Тип проверки документа (закладка «правописание» (ortho), «красота» (cicero) или «качество» (quality)).
	 * В зависимости от типа проверки подключаются различные наборы правил на которые проверяется текст.
	 */
	profile: CheckProfile;
	/**
	 * Идентификатор документа в системе Сайта. Если указан, то будет продолжена работа над тем же самым документом,
	 * если нет, то будет создан новый документ. Пожалуйста, обратите внимание на то обстоятельство, что в данный
	 * момент в Литере5 с документом может работать только один пользователь. Поэтому несмотря на то, что в CMS с
	 * документом могут работать различные пользователи, при работе с одним и тем же документом в API имеет смысл
	 * передавать в `login` не идентификатор текущего пользователя CMS Партнёра, а идентификатор пользователя создавшего
	 * данный документ в Литере5 (того пользователя в результате проверки которого был выдан этот `document`). В
	 * противном случае API выдаст ошибку о недостатке прав пользователя на работу с документом.
	 */
	document: string;
	/**
	 * Название документа (title, subject). Если не указано, то будет сформировано автоматически из текста.
	 */
	name: string;
	/**
	 * Оригинальные текст для проверки в формате html. Если указан `document`, то текст заместит собой текст
	 * выбранного `document`. Этот текст используется для отображения проверок в интерфейсе Литеры.
	 */
	html: string;
	/**
	 * Текст для проверки в формате ogxt полученный из текста html, например при помощи утилит ogxt-utils
	 */
	ogxt: string;
}

export interface CheckOgxtResponse extends Dict {
	document: string;
	check: string;
}

export interface CheckOgxtResultsRequest extends Dict {
	/**
	 * Идентификатор проверки в системе Сайта полученный в CheckOgxtResponse при запросе check-ogxt.
	 */
	check: string;
}

export interface CheckOgxtResultsResponse extends Dict {
	/**
	 * Текущее состояние проверки. Все возможные значения можно разделить на три группы:
	 * Проверка благополучно завершена (CHECKED_SUCCESS),
	 * проверка не удалась (ESTIMATED_ERROR, ESTIMATED_REJECT, CANCELLED, REJECTED, CHECKED_ERROR) и
	 * проверка ещё не закончилась (CREATED, UPLOADED, WAITING_ESTIMATION, ESTIMATING, ESTIMATED_SUCCESS, WAITING_CHECK,
	 * CHECKING)
	 */
	state: CheckState;
	/**
	 * Прогресс проверки в целых процентах (число)
	 */
	progress: number;
	/**
	 * Дополнительное текстовое сообщение разъясняющее текущее состояние (в случае ошибочных состояний здесь будет
	 * поясняющее объяснение сложившейся ситуации)
	 */
	message: string;
	/**
	 * HTML который был подвергнут проверке в который можно встраивать результаты (на случай, если текст уже изменился)
	 */
	html?: string;
	/**
	 * JSON модель результатов проверки
	 */
	annotations?: CheckResults;
	/**
	 * JSON модель статистического отчёта
	 */
	stats?: CheckStats;
}
