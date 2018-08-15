/**
 * @module util.class
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
const _ = require('underscore');
const Backbone = require('backbone');

Backbone.Class = function() {
	this.initialize.apply(this, arguments);
}

_.extend(Backbone.Class.prototype, Backbone.Events, {

	initialize: function() {
		return this;
	},

	toString: function() {
		return `[object ${(this.constructor.NAME) ? this.constructor.NAME : 'Class'}]`;
	}

});

Backbone.Class.extend = Backbone.Model.extend;

module.exports = Backbone.Class;
