var chai = require('chai');
var _ = require('lodash');

chai.use(require('chai-as-promised'));
chai.should();

var Api = require('../src/index');

var API_URL = 'http://localhost:8080/www/';
var API_COMPANY = 'hitsoft';
var API_SECRET = 'J5ZxT5zX1CsA6TDtyQKnWFtz9gABr3LVZWs3RhJvU3yjV1KsC5WwazjqQc0b4NHk';

describe('Api', function () {

	var api = new Api(API_COMPANY, API_SECRET, API_URL);

	describe('setup', function () {
		it('должен выполняться', function () {
			// var test = api.setup({});
			// return test.should.be.fulfilled;
		});
	});


});
