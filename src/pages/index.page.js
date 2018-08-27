/**
 * @module pages
 **/
const _ = require('util/mixin');
const Backbone = require('backbone');
const IndexModel = require('model/index');
const ViewHelper = require('util/proxy/view-helper');
const ShipmentView = require('ui/shipment/shipment');
const Collection = require('util/adt/collection');
require('tachyons/css/tachyons.css');
require('styles/global.css');

const IndexPage = Backbone.View.extend({

	el: '.main',

	initialize: function(options) {
		IndexModel.__super__.initialize.apply(this, arguments);
		// Note: Look at the notes in util/proxy/view. Here are both cases:
		// return ViewHelper.proxy(this.attachEvents(), options, this.constructor.properties);
		return Object.assign(this.attachEvents(), _.accept(options, this.constructor.properties, this.getDefaults()));
	},

	getDefaults: function() {
		return { views: Collection.new([], { interface: ShipmentView }) };
	},

	attachEvents: function() {
		this.listenTo(this.model.get('shipments'), 'update', this.update);
		this.listenTo(this.views, Collection.events.reset, this.onNoShipments);
		return this;
	},

	render: function() {
		this.views.invoke('render');
		return this;
	},

	update: function() {
		this.views.set(this.model.get('shipments').toJSON(), { new: this.createView.bind(this) });
		return this.render();
	},

	createView: function(shipment) {
		return ShipmentView.new({
			parent: this,
			el: `.shipment[data-id="${shipment.id}"]`,
			model: this.model.get('shipments').findWhere(shipment)
		});
	},

	onNoShipments: function() {
		console.log('views has been reset', this.views.size());
	}

}, {

	properties: [
		'parent',
		'targetEl',
		'method'
	],

	new: function() {
		const model = IndexModel.new(), page = new IndexPage({ model });
		model.fetchData();
		return page;
	}

});

module.exports = IndexPage;
