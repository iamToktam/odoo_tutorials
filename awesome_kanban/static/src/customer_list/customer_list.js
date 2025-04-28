import {Component, onWillStart} from "@odoo/owl";
import {useService} from "@web/core/utils/hooks";

export class CustomerList extends Component {
	static template = "awesome_kanban.CustomerList";
	static props = {
		selectCustomer: {
			type: Function,
		},
	};

	// هرچی میخوای قبل از نمایش آماده کن
	setup() {
		this.orm = useService("orm");
		onWillStart(async () => {
			this.partners = await this.orm.searchRead("res.partner", [], ["display_name"]);
		})
	}
}