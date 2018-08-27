/**
 * @module util.adt
 **/
const _ = require('util/mixin');
const Collection = require('util/adt/collection');

const Queue = Collection.extend({

	getDefaults: function() {
		return { capacity: 0 };
	},

	_hasOverflown: function(element) {
		return (this.size() >= this.capacity);
	},

	set: function(elements, options) {
		if(!_.defined(options)) options = {};
		if(!_.defined(options.capacity)) Object.assign(options, this.getDefaults());
		this.capacity = options.capacity;
		return Queue.__super__.set.apply(this, arguments);
	},

	offer: function(element) {
		if(this._hasOverflown(element)) return false;
		this.add(element);
		return true;
	},

	peek: function() {
		return this.isEmpty() ? null : this.at(0);
	},

	poll: function() {
		return this.isEmpty() ? null : this.removeAt(0);
	}

}, {

	properties: [
		'capacity'
	],

	new: function() {
		return _.construct(Queue, _.toArray(arguments));
	}

});

module.exports = Queue;
