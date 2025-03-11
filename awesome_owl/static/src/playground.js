/** @odoo-module **/

import {Component, markup, useState} from "@odoo/owl";
import {Counter} from "./counter/counter";
import {Card} from "./card/card";
import {TodoList} from "./todolist/todolist";

export class Playground extends Component {
	static template = "awesome_owl.Playground";
	static components = {Counter, Card, TodoList};

	setup() {
		// markup
		this.safeContent = markup("<p>safe HTML</p>");
		this.unsafeContent = "<p>unsafe HTML</p>";
		//sum
		this.state = useState({sum: 0});
		this.incrementSum = this.incrementSum.bind(this);
	}

	incrementSum() {
		this.state.sum += 1;
	}

}
