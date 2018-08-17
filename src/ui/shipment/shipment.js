/**
 * @module ui.shipment
 **/
const _ = require('util/mixin');
const Backbone = require('backbone');
const ShipmentTpl = require('templates/ui/shipment/shipment.html')

const Shipment = Backbone.View.extend({

	className: 'shipment w-50 pa3',

	initialize: function(options) {
		Shipment.__super__.initialize.apply(this, arguments);
		return Object.assign(this, _.accept(options, this.constructor.properties, this.getDefaults()));
	},

	getDefaults: function() {
		return { template: _.template(ShipmentTpl) };
	},

	targetEl: function() {
		return _.defined(this.parent) && _.defined(this.parent.targetEl) ? _.result(this.parent, 'targetEl') : $('body');
	},

	element: function() {
		this.setElement($(this.el).appendTo(_.result(this, 'targetEl')));
		return this;
	},

	render: function() {
		Shipment.__super__.render.apply(this, arguments);
		return this.element().update().delegateEvents();
	},

	update: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

}, {

	properties: [
		'parent',
		'targetEl'
	],

	new: function() {
		return _.construct(Shipment, _.toArray(arguments));
	}

});

module.exports = Shipment;
