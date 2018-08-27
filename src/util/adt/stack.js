/**
 * @module util.adt
 **/
const _ = require('util/mixin');
const Collection = require('util/adt/collection');

const Stack = Collection.extend({

	/**
	 * Push a new element into the stack
	 * @public
	 * @param {any} element - element to be inserted
	 * @param {object} options
	 * @returns {any}
	 **/
	push: function(element, options) {
		if(!this._valid(element)) return false;
		return this.add(element, options);
	},

	/**
	 * Retrieves, but does not remove the head of this stack or returns null if the stack is empty.
	 * @public
	 * @returns {any|null}
	 **/
	peek: function() {
		return !this.isEmpty() ? this._collection[0] : null;
	},

	/**
	 * Retrieves and removes the head of this stack or returns null if the stack is empty.
	 * @public
	 * @returns {any|null}
	 **/
	pop: function() {
		return !this.isEmpty() ? this.removeAt(0) : null;
	},

	/**
	 * Returns the 1-based position where an object is on this stack
	 * @public
	 * @param {any} element - element used to retrieve the index
	 * @returns {number}
	 **/
	search: function(element) {
		return this.findIndex((element) => this.contains(element));
	}

}, {

	/**
	 * @static
	 * @property NAME
	 **/
	NAME: 'Stack'

});

module.exports = Stack;
