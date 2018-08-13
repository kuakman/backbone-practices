/**
 * @module pages
 * @author Patricio Ferreira <patricio.ferreira@build.com>
 **/
import Backbone from 'backbone';
import IndexModel from 'model/index';

class IndexPage extends Backbone.View<IndexModel> {

	initialize() {
		super.initialize();
		return this;
	}

	render() {
		console.log(this.model.toJSON());
		return this;
	}

	static new(): IndexPage {
		return new IndexPage({ model: IndexModel.new() }).render();
	}

}

export default IndexPage;
