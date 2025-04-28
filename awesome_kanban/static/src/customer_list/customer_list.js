import {useService} from "@web/core/utils/hooks";
import {Component, onWillStart, useState} from "@odoo/owl";
import {KeepLast} from "@web/core/utils/concurrency";
import {fuzzyLookup} from "@web/core/utils/search";
import {Pager} from "@web/core/pager/pager";


export class CustomerList extends Component {
    static components = {Pager};
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

        // مقدار اولیه برای صفحه‌بندی
        this.pager = useState({offset: 0, limit: 20});

        // آخرین درخواست رو نگه دار، قبلی‌ها رو بیخیال شو
        this.keepLast = new KeepLast();

        // ساختن حالت واکنشی برای فیلتر کردن مشتری‌ها
        this.state = useState({
            searchString: "",
            // آیا فقط مشتری‌های فعال رو نشون بدیم یا همه رو؟
            displayActiveCustomers: false,
        })

        // قبل از اینکه اصلا چیزی به کاربر نشون بدیم
        onWillStart(async () => {
            const {length, records} = await this.loadCustomers();
            this.partners.data = records;
            this.pager.total = length;
        })
    }

    // بعد از سرچ لیست مشتری‌های فیلتر شده رو برمی‌گردونه
    get displayedPartners() {
        return this.filterCustomers(this.state.searchString);
    }

    // کنترل تغییر چک باکس
    async onChangeActiveCustomers(ev) {
        // به‌روزرسانی وضعیت نمایش مشتری‌های فعال
        this.state.displayActiveCustomers = ev.target.checked;

        // لود مشتری با توجه به فیلتر جدید
        this.partners.data = await this.keepLast.add(this.loadCustomers());

        // ریست کردن offset
        this.pager.offset = 0;

        // بارگذاری دوباره مشتری بعد از تغییرات
        const {length, records} = await this.keepLast.add(this.loadCustomers());

        // به‌روزرسانی داده‌های مشتری‌
        this.partners.data = records;

        // به‌روزرسانی تعداد کل مشتری‌
        this.pager.total = length;
    }

    // مشتری‌ها رو فیلتر می‌کنه بر اسای چیزی که وارد کردیم
    filterCustomers(name) {
        if (name) {
            return fuzzyLookup(name, this.partners.data, (partner) => partner.display_name);
        } else {
            // // اگه چیزی وارد نشده بود، کل مشتری‌ها رو نشون میده
            return this.partners.data;
        }
    }

    // از سرور مشتری ها رو میاره
    loadCustomers() {
        // کدوم صفحه و چقدر داده باید بارگذاری بشه
        const {limit, offset} = this.pager;

        // اعمال فیلتر
        const domain = this.state.displayActiveCustomers ? [["opportunity_ids", "!=", false]] : [];

        // درخواست به سرور برای دریافت مشتری‌ها
        return this.orm.webSearchRead("res.partner", domain, {
            specification: {
                "display_name": {},
            },
            limit,
            offset,
        })
    }

    // وقتی صفحه عوض میشه
    async onUpdatePager(newState) {
        // به‌روزرسانی وضعیت
        Object.assign(this.pager, newState);

        // بارگذاری مشتری‌ها با شرایط جدید
        const {records} = await this.loadCustomers();

        // به‌روزرسانی داده‌های مشتری‌ها با رکوردهای جدید
        this.partners.data = records;

        // فیلتر کردن
        this.filterCustomers(this.filterName);
    }
}