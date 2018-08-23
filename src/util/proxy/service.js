/**
 * @module util.proxy
 **/
const _ = require('underscore');
const Backbone = require('backbone');
const Class = require('util/class/class');

const Service = Class.extend({

	proxy: function(model) {
		return Service.methods.reduce((model, method) => {
			if(this[method]) model[method] = this[method].bind(model);
			return model;
		}, model);
	},

	payload: function(params) {
		const filtered = _.omit(params, 'path');
		return Object.assign({ type: Service.verbs.Post, url: this.resolveUrl(params.path) }, filtered);
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
	},

	getVerbs: function() {
		return Service.verbs;
	}

}, {

	NAME: 'Service',

	verbs: {
		Get: 'GET',
		Post: 'POST',
		Put: 'PUT',
		Delete: 'DELETE',
		Patch: 'PATCH'
	},

	methods: ['payload', 'resolveUrl', 'parse', 'execute', 'onResponse'],

	new: function() {
		return new Service();
	}

});

module.exports = Service.new();
