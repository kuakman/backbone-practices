/**
 * @module model
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
const Backbone = require('backbone');
const Service = require('util/proxy/service');

const IndexModel = Backbone.Model.extend({

	defaults: function() {
		return { property: 1 };
	},

	initialize: function() {
		return Service.proxy(this);
	},

	url: function() {
		return '/test';
	},

	fetchData: function(success, fail) {
		return this.execute({
			path: '/post/json',
			data: {},
			onParse: this.onData.bind(this)
		}, success, fail);
	},

	onData(model, response) {
		model.set(response);
	}

}, {

	new: function() {
		return new IndexModel();
	}

});

module.exports = IndexModel;
