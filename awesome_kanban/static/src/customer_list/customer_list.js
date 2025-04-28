import {useService} from "@web/core/utils/hooks";
import {Component, onWillStart, useState} from "@odoo/owl";
import {KeepLast} from "@web/core/utils/concurrency";
import {fuzzyLookup} from "@web/core/utils/search";


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
        // مشتری ها اینجان
        this.partners = useState({data: []});

        // مشتری های بعد فیلتر اینجان
        this.displayedPartners = useState({data: []});

        // ذخیره عبارت جست و جو
        this.filterName = "";

        // آخرین درخواست رو نگه دار، قبلی‌ها رو بیخیال شو
        this.keepLast = new KeepLast();

        // قبل از اینکه اصلا چیزی به کاربر نشون بدیم
        onWillStart(async () => {

            // برو مشتری ها رو از سرور بگیر
            this.partners.data = await this.loadCustomers([]);

            // کپی مشتری ها برای نمایش بعد فیلتر
            this.displayedPartners.data = this.partners.data;
        })
    }

    // کنترل چک باکس
    async onChangeActiveCustomers(ev) {
        const checked = ev.target.checked;
        const domain = checked ? [["opportunity_ids", "!=", false]] : [];
        this.partners.data = await this.keepLast.add(this.loadCustomers(domain));
        this.filterCustomers(this.filterName);
    }

    // به محض تایپ اسم مشتری، همون مشتری‌ها رو پیدا می‌کنه
    onCustomerFilter(ev) {
        this.filterName = ev.target.value;
        this.filterCustomers(ev.target.value);
    }

    // مشتری‌ها رو فیلتر می‌کنه
    filterCustomers(name) {
        if (name) {
            this.displayedPartners.data = fuzzyLookup(
                name,
                this.partners.data,
                (partner) => partner.display_name
            );
        } else {
            this.displayedPartners.data = this.partners.data;
        }
    }

    // از سرور مشتری ها رو میاره
    loadCustomers(domain) {
        return this.orm.searchRead("res.partner", domain, ["display_name"]);
    }
}