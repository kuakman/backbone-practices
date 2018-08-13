/**
 * @module util.class
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
import { Events } from 'backbone';

export interface IClass {
	initialize(): IClass;
	toString(): string;
}

declare const IClass: {
	new (prop: string): IClass;
}

class Class extends Events implements IClass {

	constructor() {
		super();
		return this.initialize.apply(this, arguments);
	}

	initialize() {
		return this;
	}

	toString() {
		return `[object ${Class.name}]`;
	}

	static NAME = 'BackboneClass';
}

export default Class;
