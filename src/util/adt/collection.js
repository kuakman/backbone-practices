/**
 * @module util.adt
 **/
const _ = require('util/mixin');
const Class = require('util/class/class');

const Collection = Class.extend({

	/**
	 * Collection Constructor
	 * @constructor
	 * @returns {Collection}
	 **/
	constructor(initial, options) {
		Object.assign(this, _.accept(options, this.constructor.properties, this.getDefaults()));
		return this.initialize.apply(this, arguments);
	},

	/**
	 * Initialize
	 * @public
	 * @param {any[]} initial - the initial collection
	 * @param {object} options - collection options
	 * @returns {Collection}
	 **/
	initialize: function(initial, options) {
		Collection.__super__.initialize.apply(this, arguments);
		return this.set(initial, { silent: true });
	},

	/**
	 * Validates Collection Element
	 * @private
	 * @returns {boolean}
	 **/
	_valid: function(o) {
		return _.defined(o);
	},

	/**
	 * Retrieves Default Options
	 * @public
	 * @returns {object}
	 **/
	getDefaults: function() {
		return { _collection: [], interface: null };
	},

	/**
	 * Fires collection event
	 * @private
	 * @param {string} eventName - event name
	 * @param {any} eventParams - event parameters
	 * @param {object} options
	 * @returns {Collection}
	 **/
	_fire: function(eventName, eventParams, options) {
		if(!_.defined(options)) options = {};
		return options.silent ? this : this.trigger(eventName, eventParams);
	},

	/**
	 * Returns a json representation of a given element if the element implements the interface method 'toJSON',
	 * verbatim element is returned otherwise.
	 * @private
	 * @param {any} element - the given element
	 * @returns {any}
	 **/
	_json: function(element) {
		return _.defined(element.toJSON) ? element.toJSON() : element;
	},

	/**
	 * Default instanciation strategy for new elements added in this collection.
	 * @private
	 *
	 **/
	_new: function(element, options) {
		if(!_.defined(options)) options = {};
		return _.defined(options.new) ? options.new(element) : element;
	},

	/**
	 * Resets the collection
	 * @public
	 * @returns {Collection}
	 **/
	reset: function(options) {
		if(!_.defined(options)) options = {};
		this._collection = [];
		return this._fire(Collection.events.reset, this, options);
	},

	// TODO

	set: function(collection, options) {},
	add: function() {},
	addAll: function() {},
	remove: function() {},
	removeAt: function() {},
	removeBy: function() {},
	removeAll: function() {},
	reset: function() {},
	at: function() {},
	containsBy: function() {},
	containsAll: function() {},
	toJSON: function() {}

}, {

	/**
	 * @static
	 * @property NAME
	 **/
	NAME: 'Collection',

	/**
	 * @static
	 * @property EVENTS
	 **/
	events: {
		added: 'util:adt:collection:added',
		removed: 'util:adt:collection:removed',
		addedAll: 'util:adt:collection:addedAll',
		removedAll: 'util:adt:collection:removedAll',
		replacedAll: 'util:adt:collection:replacedAll',
		sorted: 'util:adt:collection:sorted',
		reset: 'util:adt:collection:reset'
	},

	/**
	 * @static
	 * @property properties
	 **/
	properties: [
		'parent',
		'interface'
	],

	/**
	 * Underscore list of methods to aggregate into this collection class
	 **/
	_methods: [
		'forEach', 'each', 'map', 'collect', 'reduce', 'foldl', 'inject',
		'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select', 'reject',
		'every', 'all', 'some', 'any', 'include', 'includes', 'contains',
		'invoke', 'max', 'min', 'toArray', 'size', 'first', 'head',
		'take', 'initial', 'rest', 'tail', 'drop', 'last', 'without',
		'difference', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'chain', 'sample',
		'partition', 'groupBy', 'countBy', 'sortBy', 'indexBy', 'findIndex', 'findLastIndex'
	],

	/**
	 *	Aggreates underscore methods into this class statically
	 * @static
	 **/
	_aggregate: function() {
		_.each(this._methods, (method) => {
			if(!_.defined(_[method]) || _.defined(this.prototype[method])) return;
			this.prototype[method] = function() {
				return _[method].apply(this, [this._collection].concat(_.toArray(arguments)));
			}
		});
		return this;
	},

	/**
	 * Static Constructor
	 * @static
	 * @returns {Collection}
	 **/
	new: function() {
		return _.construct(Collection, _.toArray(arguments));
	}

});

module.exports = Collection._aggregate();
