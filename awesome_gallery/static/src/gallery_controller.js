/** @odoo-module */

import {Layout} from "@web/search/layout";
import {useService} from "@web/core/utils/hooks";

import {Component, onWillStart, onWillUpdateProps, useState} from "@odoo/owl";

import {standardViewProps} from "@web/views/standard_view_props";

import {usePager} from "@web/search/pager_hook";


export class GalleryController extends Component {
	static template = "awesome_gallery.GalleryController";
	static props = {
		...standardViewProps,
		archInfo: Object,
		Model: Function,
		Renderer: Function,

	};
	static components = {Layout};

	setup() {
		// ارتباط با سرویس برای خواندن و فرستادن داده
		this.orm = useService("orm");

		// ساخت یک شی از مدل گالری
		this.model = useState(
			new this.props.Model(
				this.orm,
				this.props.resModel,
				this.props.fields,
				this.props.archInfo,
			)
		);

		// ایجاد صفحه بندی
		usePager(() => {
				return {
					offset: this.model.pager.offset,
					limit: this.model.pager.limit,
					total: this.model.recordsLength,
					onUpdate: async ({offset, limit}) => {
						this.model.pager.offsrt = offset;
						this.model.pager.limit = limit;
						await this.model.load(this.props.domain);
					},
				};
			}
		);

		// بارگذاری اولیه
		onWillStart(async () => {
			await this.model.load(this.props.domain);
		});

		// بعد از فیلتر دیتای مجدد میگیره
		onWillUpdateProps(async (nextProps) => {
			if (JSON.stringify(nextProps.domain) !== JSON.stringify(this.props.domain)) {
				await this.model.load(nextProps.domain);
			}
		});
	}

	// وقتی کاربر یه عکس جدید بده، میره روی همون رکورد آپدیت می‌کنه
	async onImageUpload(record_id, image_binary) {
		this.model.uploadImage(record_id, image_binary, this.props.domain);
	}

}
