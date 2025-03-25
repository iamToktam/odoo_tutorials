/** @odoo-module **/

import {NumberCard} from "@awesome_dashboard/dashboard/number_card/number_card";
import {PieChart} from "@awesome_dashboard/dashboard/pie_chart/pie_chart";
import {registry} from "@web/core/registry";
import { _t } from "@web/core/l10n/translation";

const items = [
	{
		id: "nb_new_orders",
		description: _t("Number of new orders this month"),
		Component: NumberCard,
		props: (data) => ({
			title: _t("Number of new orders this month"),
			value: data.nb_new_orders,
		}),
	},
	{
		id: "total_amount",
		description: _t("Total amount of new orders this month"),
		Component: NumberCard,
		props: (data) => ({
			title: _t("Total amount of new orders this month"),
			value: data.total_amount,
		}),
	},
	{
		id: "average_quantity",
		description: _t("Average amount of t-shirt"),
		Component: NumberCard,
		props: (data) => ({
			title: _t("Average amount of t-shirt"),
			value: data.average_quantity,
		}),
	},
	{
		id: "nb_cancelled_orders",
		description: _t("Number of cancelled orders this month"),
		Component: NumberCard,
		props: (data) => ({
			title: _t("Number of cancelled orders this month"),
			value: data.nb_cancelled_orders,
		}),
	},
	{
		id: "average_time",
		description: _t("Average time for an order to go from 'new' to 'sent' or 'cancelled'"),
		Component: NumberCard,
		size: 2,
		props: (data) => ({
			title: _t("Average time for an order to go from 'new' to 'sent' or 'cancelled'"),
			value: data.average_time,
		}),
	},
	{
		id: "orders_by_size",
		description: "Orders pie chart",
		Component: PieChart,
		props: (data) => ({
			datasets: [{data: Object.values(data.orders_by_size)}],
			labels: Object.keys(data.orders_by_size).map((label) => label.toUpperCase()),
			orders_by_size: data.orders_by_size
		}),
	},
];

items.forEach((item) => {
	registry.category("awesome_dashboard").add(item.id, item);
});