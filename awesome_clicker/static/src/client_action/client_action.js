import {Component, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
// components
import {ClickerValue} from "../clicker_value/clicker_value";
import {Notebook} from "@web/core/notebook/notebook";

class ClickerClientAction extends Component {
	static template = "awesome_clicker.ClickerClientAction";
	static props = ["*"];

	static components = {ClickerValue, Notebook};

	setup() {
		this.clickService = useState(useService("awesome_clicker.clicker"));
	}
}

registry.category("actions").add("awesome_clicker.client_action", ClickerClientAction);