/**
 * @module util.proxy
 **/
const _ = require('util/mixin');
const Backbone = require('backbone');
const Class = require('util/class/class');

/**
* Important Notes: (Discuss with the guys if these rules are complicated.)
*	- Use `el` to query for existing dom element bound to Backbone.View (don't use $el) in sub views.
*	  This Proxy will ensure that the element will be rendered if it doesn't exists in the dom or it will pick it up.
*	- If the parent view is not proxified by this class, the $el element of the parent view will be used for subviews,
*	  if `targetEl` is not defined or passed as an option to the subview.
*	- If the parent view is being `proxified` by this class, the logic being aggregated by _targetEl logic will be
*	  evaludated same way as the sub views of the parent view.
**/

let _singleton = null;

const ViewHelper = Class.extend({

	/**
	 * Returns true if a given view is an instance of Backbone.View (or a class that inherits from Backbone.View),
	 * false otherwise.
	 * @public
	 * @scope {View}
	 * @param {Backbone.View} view - instance to evaluate
	 * @returns {boolean}
	 **/
	_valid: function(view) {
		return (view instanceof Backbone.View);
	},

	/**
	 * Delegate methods into a given view
	 * @public
	 * @param {Backbone.View} view - the instance of a view to be aggregated
	 * @returns {Backbone.View}
	 **/
	_delegate: function(view) {
		return ViewHelper.methods.reduce((view, method) => {
			if(this[method] && !_.defined(view[method])) view[method] = this[method].bind(view);
			return view;
		}, view);
	},

	/**
	 * Delegates methods to the given instance of a view
	 * @public
	 * @scope {View}
	 * @param {Backbone.View} view - view to proxify
	 * @param {object} options - view options
	 * @param {string[]} properties - list of properties
	 * @returns {Backbone.View}
	 **/
	proxy: function(view, options, properties) {
		if(!_.defined(options) || !_.isRealObject(options)) options = {};
		if(!_.defined(properties) && !_.isArray(properties)) properties = [];
		return Object.assign(this._valid(view) ? this._delegate(view) : view,
			_.accept(options, properties, this.getDefaults(view)));
	},

	/**
	 * Aggregate properties to instances of the view being proxify
	 * @public
	 * @scope {View}
	 * @param {Backbone.View}
	 * @returns {object}
	 **/
	getDefaults: function(view) {
		return Object.assign({ parent: null, method: ViewHelper.render.appendTo },
			_.defined(view.getDefaults) ? view.getDefaults() : {});
	},

	/**
	 * Default parent view resolution
	 * @public
	 * @returns {Backbone.View|null}
	 **/
 	_parent: function() {
		return _.defined(this.parent) ? this.parent : null;
	},

	/**
	 * Default Target Element Strategy Resolution
	 * @public
	 * @scope {Backbone.View}
	 * @returns {object}
	 **/
 	_targetEl: function() {
		let parent = null;
		if(_.defined(this.targetEl)) {
			return _.result(this, 'targetEl');
		} else if(parent = this._parent()) {
			return _.defined(parent._targetEl) ? parent._targetEl() : parent.$el;
		}
		return Backbone.$('body');
	},

	/**
	 * Default Strategy that resolves how the view will be render the element in the dom
	 * @public
	 * @returns {string}
	 **/
	_renderMethod: function() {
		return _.defined(this.method) && _.defined(ViewHelper.render[this.method]) ?
			this.method : ViewHelper.render.appendTo;
	},

	/**
	 * Detects if the element is present in the dom or the view needs to create the element
	 * @public
	 * @scope {Backbone.View}
	 * @return {Backbone.View}
	 **/
	element: function() {
		const $parent = this.$el.parent();
		if (_.defined($parent) && $parent.length === 0) {
			this._ensureElement();
			this.setElement(Backbone.$(this.el)[this._renderMethod()](this._targetEl()));
		}
		return this;
	}

}, {

	/**
	 * @static
	 * @type {string}
	 **/
	NAME: 'ViewHelper',

	/**
	 * Private methods (`_` prefixed) should not be called explicitly by Backbone.View instances being proxified.
	 * Public methods may or may not call these methods in Backbone.View instances being proxified.
	 * @static
	 * @type {string[]}
	 **/
	methods: ['_parent', '_targetEl', '_renderMethod', 'element'],

	/**
	 * @static
	 * @type {object}
	 **/
	render: {
		appendTo: 'appendTo',
		prependTo: 'prependTo',
		insertAfter: 'insertAfter',
		insertBefore: 'insertBefore'
	},

	/**
	 * Proxify Backbone.View instance
	 * @static
	 * @return {Backbone.View}
	 **/
	proxy: function(view, options, properties) {
		if(!_.defined(_singleton)) _singleton = _.construct(ViewHelper, []);
		return _singleton.proxy(view, options, properties);
	}

});

module.exports = ViewHelper;
