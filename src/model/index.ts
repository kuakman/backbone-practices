/**
 * @module model
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
import Backbone, { ObjectHash} from 'backbone';
import Service, { IService, RequestParams, RequestPayload, RequestType } from 'util/proxy/service';

class IndexModel extends Backbone.Model implements IService {

	execute: (params: RequestParams, success?: Function, fail?: Function) => Backbone.Model;

	defaults(): ObjectHash {
		return { property: 1 };
	}

	url: () => string = () => {
		return '/test';
	};

	initialize() {
		return Service.proxy(this);
	}

	fetchData(success?: Function, fail?: Function) {
		return this.execute({
			path: '/post/json',
			data: {},
			onParse: this.onData.bind(this)
		}, success, fail);
	}

	onData(model: Backbone.Model, response: any = {}): any {
		model.set(response);
	}

	static new(): IndexModel {
		return new IndexModel();
	}

}

export default IndexModel;
