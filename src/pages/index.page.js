/**
 * @module pages
 **/
const Backbone = require('backbone');
const IndexModel = require('model/index');
const ShipmentView = require('ui/shipment/shipment');
const Collection = require('util/adt/collection');
require('tachyons/css/tachyons.css');

const IndexPage = Backbone.View.extend({

	el: '.main',

	initialize: function() {
		IndexModel.__super__.initialize.apply(this, arguments);
		this.views = Collection.new([], { interface: ShipmentView });
		return this.attachEvents();
	},

	attachEvents: function() {
		this.listenTo(this.model.get('shipments'), 'update', this.update);
		this.listenTo(this.views, Collection.events.reset, this.onNoShipments);
		return this;
	},

	targetEl: function() {
		return this.$el;
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
			$el: this.$el.find(`.shipment[data-id="${shipment.id}"]`),
			model: this.model.get('shipments').findWhere(shipment)
		});
	},

	onNoShipments: function() {
		console.log('views has been reset', this.views.size());
	}

}, {

	new: function() {
		const model = IndexModel.new(), page = new IndexPage({ model });
		model.fetchData();
		return page;
	}

});

module.exports = IndexPage;
