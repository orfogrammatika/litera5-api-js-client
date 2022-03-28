import { Signature } from '../Signature';
import md5 from 'md5';

describe('Signature', () => {
	const sig = new Signature('test');

	describe('_joinParams', () => {
		it('добавляет в конец секретный ингридиент', () => {
			const test = sig._joinParams(['1', '2', '3']);
			expect(test).toEqual('123test');
		});
		it('пропускает неустановленные значения (null, undefined)', () => {
			const test = sig._joinParams(['1', null, undefined, '2', null, '3']);
			expect(test).toEqual('123test');
		});
		it('преобразует числовые значения в строки', () => {
			const test = sig._joinParams([1, 2, 3]);
			expect(test).toEqual('123test');
		});
		it('преобразует логические значения в строки', () => {
			const test = sig._joinParams([true, false]);
			expect(test).toEqual('truefalsetest');
		});
		it('склеивает массивы в строку без разделителей', () => {
			const test = sig._joinParams([1, 2, [3, undefined, 4], [5, null, 6]]);
			expect(test).toEqual('123456test');
		});
	});

	describe('md5', () => {
		it('работает как в линуксе', () => {
			const test = md5('123test', { encoding: 'utf-8' });
			expect(test).toEqual('abe45d28281cfa2a4201c9b90a143095');
		});
	});

	describe('sign', () => {
		it('формирует правильную подпись', () => {
			const test = sig.sign(['1', null, undefined, '2', null, '3']);
			expect(test).toEqual('abe45d28281cfa2a4201c9b90a143095');
		});
	});

	describe('test', function () {
		it('пропускает правильную подпись', function () {
			const test = sig.test('abe45d28281cfa2a4201c9b90a143095', [
				1,
				2,
				null,
				3,
			]);
			expect(test).toBeTruthy();
		});
		it('ругается на неправильную подпись', function () {
			const test = sig.test('abe45d28281cfa2a4201c9b90a143095', [
				1,
				2,
				null,
				4,
			]);
			expect(test).toBeFalsy();
		});
	});
});
