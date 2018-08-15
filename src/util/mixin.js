/**
 *	Mixins
 **/
const _ = require('underscore');

_.mixin({

	defined: function(o) {
		return !_.isUndefined(o) && !_.isNull(o);
	},

	isRealObject: function(value) {
		return (_.defined(value) &&
			!_.isArray(value) &&
			!_.isString(value) &&
			!_.isNumber(value) &&
			!_.isBoolean(value) &&
			!_.isFunction(value) &&
			!_.isRegExp(value) &&
			!_.isDate(value) &&
			!_.isArguments(value));
	},

	query: function(o, q) {
		var arr = q.split("."), r = _.clone(o);
		while(arr.length && r) {
			r = r[arr.shift()];
		}
		return r;
	},

	accept: function(options, properties, defaults) {
		if(!_.defined(options) || !_.isRealObject(options)) options = {};
		if(!_.defined(properties) || !_.isArray(properties)) properties = [];
		if(!_.defined(defaults) || !_.isRealObject(defaults)) defaults = {};
		return _.extend(defaults, _.pick(options, properties));
	},

	construct: function(factory, args) {
		if(!_.isFunction(factory)) return factory;
		function F() { return factory.apply(this, args); }
		F.prototype = factory.prototype;
		return new F();
	}

});

module.exports = _;
