var should = require('chai').should();
var Signature = require('../src/Signature');
var md5 = require('md5');

describe('Signature', function () {

    var sig = new Signature('test');

    describe('_joinParams', function () {
        it('добавляет в конец секретный ингридиент', function () {
            var test = sig._joinParams(['1', '2', '3']);
            test.should.equal('123test');
        });
        it('пропускает неустановленные значения (null, undefined)', function () {
            var test = sig._joinParams(['1', null, undefined, '2', null, '3']);
            test.should.equal('123test');
        });
        it('преобразует числовые значения в строки', function () {
            var test = sig._joinParams([1, 2, 3]);
            test.should.equal('123test');
        });
        it('преобразует логические значения в строки', function(){
        	 var test = sig._joinParams([true, false]);
        	 test.should.equal('truefalsetest');
				});
        it('склеивает массивы в строку без разделителей', function(){
        	 var test = sig._joinParams([1, 2, [3, undefined, 4], [5, null, 6]]);
        	 test.should.equal('123456test');
				});
    });

    describe('md5', function () {
        it('работает как в линуксе', function () {
            var test = md5('123test');
            test.should.equal('abe45d28281cfa2a4201c9b90a143095');
        });
    });

    describe('sign', function () {
        it('формирует правильную подпись', function () {
            var test = sig.sign(['1', null, undefined, '2', null, '3']);
            test.should.equal('abe45d28281cfa2a4201c9b90a143095');
        });
    });

    describe('test', function () {
        it('пропускает правильную подпись', function () {
            var test = sig.test('abe45d28281cfa2a4201c9b90a143095', [1, 2, null, 3]);
            test.should.equal(true);
        });
        it('ругается на неправильную подпись', function () {
            var test = sig.test('abe45d28281cfa2a4201c9b90a143095', [1, 2, null, 4]);
            test.should.equal(false);
        });
    });
});

