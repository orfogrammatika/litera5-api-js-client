import type { CiceroKind, OrthoKind, QualityKind } from './enums';

export interface Position {
	/**
	 * начало выделения
	 */
	start: number;
	/**
	 * конец выделения
	 */
	end: number;
}

export interface Annotation {
	/**
	 * Идентификатор аннотации
	 */
	id: number;
	/**
	 * Тип ошибки
	 */
	kind: OrthoKind | CiceroKind | QualityKind;
	/**
	 * Кусочек текста, который содержит ошибку
	 */
	selection: string;
	/**
	 * Координаты позиций в файле ogxt где находится selection (может быть несколько, например, для повторяющихся
	 * частей текста)
	 */
	position: Position[];
	/**
	 * Описание ошибки
	 */
	description: string;
	/**
	 * Подсказка (что сделать с ошибкой), здесь могут быть линки <a> data-kind — это тип действия, data-kind —
	 * какое значение нужно в это действие подставить.Так же часть подсказки может быть выделена при помощи
	 * тэга  — это более подробное место ошибки, например, ошибочная буква
	 */
	suggestion?: string;
	/**
	 * Идентификатор аннотации из которой нужно взять подсказку бывает или suggestion, или suggestionId
	 */
	suggestionId?: string;
	/**
	 * Подробное объясление ошибки со ссылкой на библиотеку правил или первоисточники
	 */
	explanation: string;
	/**
	 * Внутренний номер нарушенного правила
	 */
	rule: string;
	/**
	 * Идентификатор группы, когда несколько аннотаций логически сгруппированы в одну суть.
	 * Например, однокоренные слова для синонимов
	 */
	group?: string;
}

export interface CheckResults {
	/**
	 * Подписи к типам ошибок (только те, которые встречаются в отчёте)
	 */
	kinds: {
		[key: string]: string;
	};
	/**
	 * массив обнаруженных проблем
	 */
	annotations: Annotation[];
	/**
	 * Результаты базовой проверки текста на водность
	 */
	water: {
		/**
		 * Доля водных слов в тексте (число от 0 до 1)
		 */
		content: number;
	};
	/**
	 * Результаты базовой проверки текста на частотные сочетания
	 */
	collocations: {
		/**
		 * Доля частотных повторений из двух слов в тексте (число от 0 до 1)
		 */
		bigram: number;
		/**
		 * Доля частотных повторений из трёх слов в тексте (число от 0 до 1)
		 */
		trigram: number;
		/**
		 * Доля частотных повторений из четырёх и более слов в тексте (число от 0 до 1)
		 */
		ngram: number;
	};
}

export interface AnnotationStats {
	/**
	 * внутренний тип аннотации
	 */
	kind: string;
	/**
	 * название типа для людей
	 */
	name: string;
	/**
	 * количество аннотаций этого типа
	 */
	count: number;
}

export interface WordCount {
	/**
	 * слово
	 */
	word: string;
	/**
	 * количество
	 */
	value: number;
}

export interface CheckStats {
	/**
	 * список типов аннотаций (список)
	 */
	annotations: AnnotationStats[];
	/**
	 * индекс удобочитаемости
	 */
	fleschIndex: {
		/**
		 * значение
		 */
		value: number;
		/**
		 * расшифровка
		 */
		comment: string;
	};
	/**
	 * индекс туманности
	 */
	fogIndex: {
		/**
		 * значение
		 */
		value: number;
		/**
		 * расшифровка
		 */
		comment: string;
	};
	/**
	 * статистика текста
	 */
	statistic: {
		/**
		 * знаков
		 */
		chars: number;
		/**
		 * знаков без пробелов
		 */
		charsNoSpace: number;
		/**
		 * слогов
		 */
		syllables: number;
		/**
		 * слов
		 */
		words: number;
		/**
		 * предложений
		 */
		sentenses: number;
		/**
		 * параграфов
		 */
		paragraphs: number;
		/**
		 * заголовков
		 */
		headers: number;
		/**
		 * уникальных слов
		 */
		uniqueWords: number;
		/**
		 * уникальных форм
		 */
		uniqueForms: number;
		/**
		 * слов в предложении
		 */
		wordsInSentence: number;
		/**
		 * букв в слове
		 */
		lettersInWord: number;
		/**
		 * слов в параграфе
		 */
		wordsInParagraph: number;
		/**
		 * предложений в параграфе
		 */
		sentencesInParagraph: number;
		/**
		 * слогов в слове
		 */
		syllablesInWord: number;
		/**
		 * цена проверки документа в 1/10 страниц (180 знаков с пробелами), не меньше 1/2 страницы (при объёме текста меньше 900 знаков).
		 */
		price: number;
	};
	/**
	 * SEO-анализ
	 */
	seo: {
		/**
		 * тошнота классическая
		 */
		nauseaClassic: number;
		/**
		 * тошнота академическая
		 */
		nauseaAcademic: number;
		/**
		 * водность
		 */
		water: number;
		/**
		 * количество частотных биграмм
		 */
		bigramCount: number;
		/**
		 * количество частотных триграмм
		 */
		trigramCount: number;
		/**
		 * количество частотных тетра-и-более-грамм
		 */
		ngramCount: number;
		/**
		 * список неестественных повторяющихся сочетаний
		 */
		wrongColls: string[];
	};
	/**
	 * содержимое
	 */
	content: {
		/**
		 * слова из частного словаря
		 */
		userWords: string;
	};
	/**
	 * коммуникация
	 */
	time: {
		/**
		 * среднее время набора текста
		 */
		write: string;
		/**
		 * среднее время чтения вслух
		 */
		spell: string;
		/**
		 * среднее время чтения про себя
		 */
		read: string;
	};
	/**
	 * наиболее...
	 */
	top: {
		/**
		 * часто встречающиеся слова (список)
		 */
		mostFrequentWords: WordCount[];
		/**
		 * часто встречающиеся формы (список)
		 */
		mostFrequentForms: WordCount[];
		/**
		 * длинные слова (список)
		 */
		mostLongWords: WordCount[];
		/**
		 * часто встречающиеся имена собственные (список)
		 */
		mostFrequentProperName: WordCount[];
	};
}
