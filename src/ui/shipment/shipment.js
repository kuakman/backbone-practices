/**
 * @module ui.shipment
 **/
const _ = require('util/mixin');
const Backbone = require('backbone');
const ViewHelper = require('util/proxy/view-helper');
const ShipmentTpl = require('templates/ui/shipment/shipment.html')
require('styles/shipment/shipment.css');

const Shipment = Backbone.View.extend({

	className: 'shipment w-50 pa3',

	initialize: function(options) {
		Shipment.__super__.initialize.apply(this, arguments);
		return ViewHelper.proxy(this, options, this.constructor.properties);
	},

	getDefaults: function() {
		return { template: _.template(ShipmentTpl) };
	},

	render: function() {
		Shipment.__super__.render.apply(this, arguments);
		return this.element().update().delegateEvents();
	},

	update: function() {
		Shipment.__super__._setAttributes.call(this, { 'data-id': this.model.get('id') });
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

}, {

	properties: [
		'setAttributes',
		'parent',
		'targetEl',
		'method'
	],

	new: function() {
		return _.construct(Shipment, _.toArray(arguments));
	}

});

module.exports = Shipment;
