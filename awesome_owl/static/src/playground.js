/** @odoo-module **/

import { Component, markup } from "@odoo/owl";
import { Counter } from "./counter/counter";
import { Card } from "./card/card";

export class Playground extends Component {
    static template = "awesome_owl.Playground";
    static components = { Counter, Card };

    setup() {
        this.safeContent = markup("<em>safe HTML</em>");
        this.unsafeContent = "<strong>unsafe HTML</strong>";
    }

}
