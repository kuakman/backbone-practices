/**
 * @module model
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
import Backbone from 'backbone';
// import Service from 'util/proxy/model';

class IndexModel extends Backbone.Model {

	defaults() {
		return { property: 1
		};
	}

	initialize() {
		return this;
	}

	static new(): IndexModel {
		return new IndexModel();
	}

}

export default IndexModel;
