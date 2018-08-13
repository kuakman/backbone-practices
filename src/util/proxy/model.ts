/**
 * @module util.proxy
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
import Backbone from 'backbone';
import Class from 'util/class/class';

export interface IService {
	proxy(model: Backbone.Model): Backbone.Model;
}

class Service extends Class implements IService {

	initialize() {
		console.log('Service.initialize()...');
		return super.initialize();
	}

	proxy(model: Backbone.Model): Backbone.Model {
		return model;
	}

}

export default Service;
