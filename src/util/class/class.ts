/**
 * @module util.class
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
import _ from 'underscore';
import { Events } from 'backbone';

export interface IClass {
	initialize(): IClass;
	toString(): string;
}

declare const IClass: {
	new (prop: string): IClass;
}

class Class implements IClass {

	constructor(...args: any[]) {
		return _.extend(this.initialize(...args), Events);
	}

	initialize(...args: any[]) {
		return this;
	}

	toString() {
		return `[object ${Class.name}]`;
	}

	static NAME = 'BackboneClass';
}

export default Class;
