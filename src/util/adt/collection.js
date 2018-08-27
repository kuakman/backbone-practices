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
		let properties = _.accept(options, this.constructor.properties, this.getDefaults());
		Object.assign(this, properties);
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
	 * Validates Collection Interface
	 * @private
	 * @returns {boolean}
	 **/
	_validInterface: function() {
		return _.defined(this.interface) && _.isFunction(this.interface);
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
	 * Instantiation strategy made by interface if it's defined.
	 * @public
	 * @param {any} element - the element being instantiated
	 * @returns {any}
	 **/
	_newByInterface: function(element) {
		return this._validInterface() ? new this.interface(element) : element;
	},

	/**
	 * Instantiation strategy for new elements added in this collection.
	 * This method will try first by using a custom method if options.new is defined.
	 * If custom method is not defined, instantiation made by interface will be tried.
	 * If none applied, the element is being returned verbatim as-is.
	 * @private
	 * @param {any} element - the element being instantiated
	 * @param {object} Options
	 * @returns {any}
	 **/
	_newByMethod: function(element, options) {
		if(!_.defined(options)) options = {};
		return _.defined(options.new) && _.isFunction(options.new) ?
			options.new(element) : this._newByInterface(element);
	},

	/**
	 * Instantiate a new element via interface
	 * @private
	 * @param {any|undefined} element - new element to instantiate
	 * @param {object} options
	 * @returns {any}
	 **/
	_newElement: function(element, options) {
		let newElement = element;
		if(this._valid(element) && this._validInterface()) {
			newElement = this._newByMethod(element, options);
			newElement.collection = this;
		}
		return newElement;
	},

	/**
	 * Generates collection of elements out of a elements input array
	 * @private
	 * @param {any[]} elements - the input elements array
	 * @param {collection}
	 **/
	_generate: function(elements, options) {
		return this._validInterface() ?
			_.compact(_.map(elements, (element) => this.add(element, options))) :
			elements.slice(0);
	},

	/**
	 * Matching strategy that evaluates equality between a given element and the existing elements in this collection.
	 * @private
	 * @param {any} element - current element
	 * @param {number} index - current element
	 * @param {any[]} elements - existing collection
	 * @returns {boolean}
	 **/
	matcher: function(given, element) {
		return _.isEqual(this._json(given), this._json(element));
	},

	/**
	 * Retrieves the collection of elements verbatim as an array
	 * @public
	 * @returns {array};
	 **/
	all: function() {
		return this._collection;
	},

	/**
	 * Resets the collection
	 * @public
	 * @param {object} options
	 * @returns {Collection}
	 **/
	reset: function(options) {
		if(!_.defined(options)) options = {};
		this._collection = [];
		return this._fire(Collection.events.reset, this, options);
	},

	/**
	 * Sets and replace all the elements inside this collection
	 * @public
	 * @param {any[]} elements - the input elements array
	 * @param {object} options
	 * @returns {Collection}
	 **/
	set: function(elements, options) {
		if(!_.defined(options)) options = {};
		if(!this._valid(elements) || !_.isArray(elements)) return this;
		this.reset({ silent: true });
		this._collection = this._generate(elements, _.defaults({ silent: true }, options));
		return this._fire(Collection.events.replacedAll, this, options);
	},

	/**
	 * Add a new element into this collection
	 * @public
	 * @param {any} element - the element being added
	 * @param {object} options
	 * @returns {any|null}
	 **/
	add: function(element, options) {
		if(!_.defined(options)) options = {};
		if(!this._valid(element)) return null;
		let newElement = this._newElement(element, options);
		this._collection.push(newElement);
		this._fire(Collection.events.added, { added: newElement, collection: this }, options);
		return newElement;
	},

	/**
	 * Add a collection of elements at the end of this collection
	 * @public
	 * @param {any[]} elements - the elements being added
	 * @param {object} options
	 * @returns {Collection}
	 **/
	addAll: function(elements, options) {
		if(!_.defined(options)) options = {};
		let newElements = this._generate(elements, options);
		this._collection = this._collection.concat(newElements);
		return this._fire(Collection.events.addedAll, { added: newElements, collection: this }, options);
	},

	/**
	 * Removes an existing element from this collection
	 * @public
	 * @param {any} element - the element being removed
	 * @param {object} options
	 * @returns {Collection}
	 **/
	remove: function(element, options) {
		if(!_.defined(options)) options = {};
		let ix = this.findIndex(this.matcher.bind(this, element));
		let removed = this.removeAt(ix, _.defaults({ silent: true }, options));
		return this._fire(Collection.events.removed, { removed: removed, collection: this }, options);
	},

	/**
	 * Removes an existing element from this collection
	 * @public
	 * @param {any} element - the element being removed
	 * @param {object} options
	 * @returns {any|null}
	 **/
	removeAt: function(ix, options) {
		if(!_.defined(options)) options = {};
		if(!this._valid(ix) || !_.isNumber(ix) || ix < 0 || ix > this.size()) return null;
		let removed = this._collection.splice(ix, 1);
		this._fire(Collection.events.removed, { removed: removed[0], collection: this }, options);
		return removed[0];
	},

	/**
	 * Removes a single element from this collection when the given predicate is satisfied.
	 * @public
	 * @param {Function} predicate - the predicate used to evaluate
	 * @param {object} options
	 * @returns {Collection}
	 **/
	removeBy: function(predicate, options) {
		if(!_.defined(options)) options = {};
		if(!this.valid(predicate) || !_.isFunction(predicate)) return this;
		let ix = this.findIndex(predicate);
		let removed = this.removeAt(ix, _.defaults({ silent: true }, options));
		return this._fire(Collection.events.removed, { removed: removed, collection: this }, options);
	},

	/**
	 * Removes a given collection of the elements from this collection.
	 * @public
	 * @param {object} options
	 * @returns {Collection}
	 **/
	removeAll: function(elements, options) {
		if(!_.defined(options)) options = {};
		let removed = [];
		_.each(elements, (element) => {
			let ix = this.findIndex(this.matcher.bind(this, element));
			removed.push(this.removeAt(ix, _.defaults({ silent: true }, options)));
		});
		return this._fire(Collection.events.removedAll, { removed: removed, collection: this }, options);
	},

	/**
	 * A convenient version of what is perhaps the most common use-case for map: extracting a list of property values.
	 * @public
	 * @param {string} propertyName - the property name used to extract values from each element
	 * @returns {Array}
	 **/
	pluck: function(propertyName) {
		return this._validInterface() ?
			this.map((element) => { return this._json(element)[propertyName]; }) :
			_.pluck.call(this, this._collection, propertyName);
	},

	/**
	 * Return an element at a given index from this collection, undefined when not found.
	 * @public
	 * @params {number} ix - the index used to retrieve the element
	 **/
	at: function(ix) {
		return this._collection[ix];
	},

	/**
	 * Returns true if a given predicate used to evaluate the comparison of elements in this collection is satisfied,
	 * at least once for a given element, false otherwise.
	 * @public
	 * @param {Function} predicate - the predicate used for comparison
	 * @returns {boolean}
	 **/
	containsBy: function(predicate) {
		if(!_.defined(predicate) || !_.isFunction(predicate)) return false;
		return _.defined(this.find((element, ix, elements) => predicate(element, ix, elements)));
	},

	/**
	 * Returns true if a given collection of elements are contained in this collection, false otherwise.
	 * @public
	 * @param {any[]} elements - the collection of elements
	 * @returns {boolean}
	 **/
	containsAll: function(elements) {
		if(!_.defined(elements) || !_.isArray(elements)) return false;
		return _.every(_.map(elements, (element) => this.contains(element)));
	},

	/**
	 * Returns a json representation of this collection
	 * @public
	 * @returns {array}
	 **/
	toJSON: function() {
		return this.reduce((memo, element) => { memo.push(this._json(element)); return memo; }, []);
	}

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
		'interface',
		'matcher'
	],

	/**
	 * Underscore list of methods to aggregate into this collection class
	 **/
	_methods: [
		'forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'filter',
		'reject', 'every', 'all', 'some', 'contains', 'invoke', 'max', 'min',
		'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without',
		'unique', 'difference', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'chain', 'sample',
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
