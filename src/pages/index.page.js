/**
 * @module pages
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
const Backbone = require('backbone');
const IndexModel = require('model/index');

const IndexPage = Backbone.View.extend({

	initialize: function() {
		IndexModel.__super__.initialize.apply(this, arguments);
		return this;
	},

	render: function() {
		console.log(this.model.toJSON());
		return this;
	}

}, {

	new: function() {
		const model = IndexModel.new(), page = new IndexPage({ model });
		model.fetchData(() => { page.render() });
		return page;
	}

});

module.exports = IndexPage;
