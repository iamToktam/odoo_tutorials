/** @odoo-module **/

import {Component, useState, useRef, onMounted} from "@odoo/owl";
import {TodoItem} from "./todoitem";
import {useAutofocus} from "../utils";

export class TodoList extends Component {
	static template = "awesome_owl.TodoList";
	static components = {TodoItem};

	setup() {
		this.todos = useState([]);
		this.toggleState = this.toggleState.bind(this);
		this.removeTodo=this.removeTodo.bind(this)
		this.nextId = 1;
		this.inputRef = useRef("add-input");
		useAutofocus(this.inputRef);

		onMounted(() => {
			this.inputRef.el.focus();
		});
	}

	addTodo(ev) {
		if (ev.keyCode === 13) {
			const description = this.inputRef.el.value.trim();

			if (description) {
				this.todos.push({
					id: this.nextId++,
					description: description,
					isCompleted: false,
				});
				this.inputRef.el.value = "";
			}
		}
	}

	toggleState(todoId) {
		const todo = this.todos.find(todo => todo.id === todoId);
		if (todo) {
			todo.isCompleted = !todo.isCompleted;
		}
	}

	removeTodo(todoId) {
		const todo = this.todos.find(todo => todo.id === todoId);
		this.todos.splice(todo, 1);
	}
}