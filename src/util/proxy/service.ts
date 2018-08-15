/**
 * @module util.proxy
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
import _ from 'underscore';
import Backbone from 'backbone';
import Class from 'util/class/class';

export enum RequestType {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
	Patch = 'PATCH'
}

export type RequestResponse = (handler: Function, response: any, request: Request) => Backbone.Model;
export type RequestPayload = (params: any, success?: Function, fail?: Function) => Backbone.Model;
export type RequestMethod = (response: any, request: Request) => any;
export type Request = { onParse: RequestMethod; }

export interface RequestParams {
	[index: string]: any;
	path: string;
	type?: string;
	data?: any;
}

export interface IService {
	proxy?(model: Backbone.Model): Backbone.Model;
	payload?(params: RequestParams, defaults: object);
	resolveUrl?(path: string): string;
	parse?: RequestMethod;
	execute?: RequestPayload
	onResponse?: RequestResponse;
}

class Service extends Class implements IService {

	payload(params: RequestParams, model?: Backbone.Model) {
		const filtered = _.omit(params, 'path');
		return Object.assign({ type: RequestType.Post, url: this.resolveUrl(params.path) }, { ...filtered });
	}

	proxy(model: Backbone.Model): Backbone.Model {
		return Service.methods.reduce((model, method) => {
			if(this[method]) {
				model[method] = this[method].bind(model);
			}
			return model;
		}, model);
	}

	resolveUrl(path: string = ''): string {
		return `${_.result(this, 'url')}${path}`;
	}

	parse(response: any, request: Request): any {
		return request.onParse ?
			request.onParse.call(this, this, response, request) :
			this.constructor.prototype.parse.apply(this, arguments);
	}

	execute(params: RequestParams, success?: Function, fail?: Function): Backbone.Model {
		return this.constructor.prototype.fetch.call(this, _.extend(this.payload(params), {
			success: this.onResponse.bind(this, success),
			error: this.onResponse.bind(this, fail)
		}));
	}

	onResponse(handler: Function, response: any, request: Request): Backbone.Model | undefined | null {
		return (handler) ? handler(this, response, request) : null;
	}

	static methods: string[] = ['payload', 'resolveUrl', 'parse', 'execute', 'onResponse'];

	static new(): IService {
		return new Service();
	}

}

export default Service.new();
