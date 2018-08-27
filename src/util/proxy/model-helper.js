/**
 * @module util.proxy
 **/
const _ = require('util/mixin');
const Backbone = require('backbone');
const Class = require('util/class/class');

let _singleton = null;

const ModelHelper = Class.extend({

	proxy: function(model) {
		return ModelHelper.methods.reduce((model, method) => {
			if(this[method]) model[method] = this[method].bind(model);
			return model;
		}, model);
	},

	payload: function(params) {
		const filtered = _.omit(params, 'path');
		return Object.assign({ type: ModelHelper.verbs.Post, url: this.resolveUrl(params.path) }, filtered);
	},

	resolveUrl: function(path) {
		if(!path) path = '';
		return `${_.result(this, 'url')}${path}`;
	},

	parse: function(response, request) {
		return request.onParse ?
			request.onParse.call(this, response, request) :
			this.constructor.prototype.parse.apply(this, arguments);
	},

	execute: function(params, success, fail) {
		return this.constructor.prototype.fetch.call(this, _.extend(this.payload(params), {
			success: this.onResponse.bind(this, success),
			error: this.onResponse.bind(this, fail)
		}));
	},

	onResponse: function(handler, response, request) {
		return (handler) ? handler(this, response, request) : null;
	}

}, {

	NAME: 'ModelHelper',

	verbs: {
		Get: 'GET',
		Post: 'POST',
		Put: 'PUT',
		Delete: 'DELETE',
		Patch: 'PATCH'
	},

	methods: ['payload', 'resolveUrl', 'parse', 'execute', 'onResponse'],

	proxy: function(model) {
		if(!_.defined(_singleton)) _singleton = _.construct(ModelHelper, []);
		return _singleton.proxy(model);
	}

});

module.exports = ModelHelper;
