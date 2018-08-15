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

	static async new(): Promise<IndexPage> {
		const model = IndexModel.new(), page = new IndexPage({ model });
		await model.fetchData(() => { page.render() });
		return page;
	}

}

export default IndexPage;
