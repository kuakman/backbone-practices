/**
 * @module model
 **/
const _ = require('util/mixin');
const Backbone = require('backbone');
const ModelHelper = require('util/proxy/model-helper');
const Shipment = require('model/shipment/shipment');

const IndexModel = Backbone.Model.extend({

	defaults: function() {
		return {
			property: 1,
			shipments: new Backbone.Collection({ model: Shipment })
		};
	},

	initialize: function() {
		return ModelHelper.proxy(this);
	},

	url: function() {
		return '/test';
	},

	fetchData: function(success, fail) {
		return this.execute({ path: '/post/json', data: {}, onParse: this.onData.bind(this) }, success, fail);
	},

	onData: function(response) {
		if(_.defined(response)) {
			this.onShipments(response.shipments);
			this.set(_.pick(response, this.constructor.properties));
		}
	},

	onShipments: function(response) {
		if(_.defined(response) && _.isArray(response)) {
			this.get('shipments').set(response);
		}
	}

}, {

	properties: [
		'property'
	],

	new: function() {
		return new IndexModel();
	}

});

module.exports = IndexModel;
