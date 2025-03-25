/** @odoo-module **/

import {Component, onWillStart, useEffect, useRef} from "@odoo/owl";
import {loadJS} from "@web/core/assets";
import {useService} from "@web/core/utils/hooks";

export class PieChart extends Component {
	static template = "awesome_dashboard.pie_chart";
	static props = ["datasets", "labels", "orders_by_size"];

	setup() {
		this.chartContext = useRef("chartContext");
		this.chart = null;
		this.action = useService("action");
		onWillStart(() => loadJS(["/web/static/lib/Chart/Chart.js"]));
		useEffect(() => {
			this.renderChart();
			return () => {
				if (this.chart) this.chart.destroy();
			};
		});
	}

	// creating and updating the Chart.js
	renderChart() {
		if (!this.chartContext.el) return;
		if (this.chart) this.chart.destroy();

		const onClick = (event, elements) => {
			if (elements.length > 0) {
				const clickedElementIndex = elements[0].index;
				const size = this.props.labels[clickedElementIndex];
				this.openOrderListView(size);
			}
		};

		this.chart = new Chart(this.chartContext.el, {
			type: "pie",
			data: this.props,
			options: {
				onClick: onClick,
			},
		});
	}

	openOrderListView(size) {
		this.action.doAction({
			type: "ir.actions.act_window",
			name: `Orders with Size ${size}`,
			res_model: "sale.order",
			domain: [["order_line.product_id.name", "like", "%T-Shirt%"],["order_line.product_no_variant_attribute_value_ids.name", "ilike", size]],
			views: [[false, "list"], [false, "form"]],
		});
	}
}


// In Odoo, a domain is a list of conditions that records must meet to be included in a search result.
// Think of it like a WHERE clause in an SQL query, but expressed in a more Odoo-specific way.
