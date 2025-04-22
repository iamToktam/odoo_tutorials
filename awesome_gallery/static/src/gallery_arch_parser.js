import {visitXML} from "@web/core/utils/xml";
// کمک می‌کنه ساختار XML رو به صورت درختی بررسی کنیم

export class GalleryArchParser {
	parse(xmlDoc) {
		const imageField = xmlDoc.getAttribute("image_field");
		const limit = xmlDoc.getAttribute("limit") || 80;

		// آرایه خالی برای نگه‌داشتن نام فیلدها
		const fieldsForTooltip = [];

		let tooltipTemplate = undefined;

		// این تابع روی همه‌ی تگ‌های XML می‌چرخه و هر تگ رو به صورت جدا میفرسته به اون تابع داخلی
		visitXML(xmlDoc, (node) => {
			if (node.tagName === "field") {
				fieldsForTooltip.push(node.getAttribute("name"));
			}
			if (node.tagName === "tooltip-template") {
				tooltipTemplate = node;
			}
		})

		return {
			imageField,
			limit,

			fieldsForTooltip,
			tooltipTemplate,
		}
	}
}