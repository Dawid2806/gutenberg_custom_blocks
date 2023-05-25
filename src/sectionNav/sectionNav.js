const { registerBlockType } = wp.blocks;
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
	PanelColorSettings,
	withColors,
} from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import style from "./style.scss";
registerBlockType("cgb/sectionnavblock", {
	title: __("Section Navigation Block", "cgb"),
	icon: "menu",
	category: "common",
	supports: {
		align: ["wide", "full"],
		html: false,
		fontSize: true,
		color: {
			background: true,
			text: true,
		},
		spacing: {
			margin: true,
			padding: true,
		},
	},
	attributes: {
		menuItems: {
			type: "array",
			default: [],
			source: "query",
			selector: ".nav-item",
			query: {
				text: {
					type: "string",
					source: "text",
					selector: "span",
				},
				id: {
					type: "string",
					source: "attribute",
					attribute: "id",
				},
			},
		},
	},

	edit: withColors("backgroundColor", { textColor: "color" })(
		({
			attributes: { menuItems, align, className },
			setAttributes,
			backgroundColor,
			textColor,
			setTextColor,
			setBackgroundColor,
		}) => {
			const categories = useSelect((select) =>
				select("core").getEntityRecords("taxonomy", "category")
			);
			const slugOrder = [
				"sagen-und-sageanlagen",
				"wasserstrahlmaschinen",
				"bearbeitungszentren",
				"kanten-flaschenschleifen",
				"innerbetriebliche-logistik",
				"sondermaschinen",
			];
			const [menu, setMenu] = useState([]);

			useEffect(() => {
				if (categories) {
					let items = categories
						.sort((a, b) => {
							const aOrder = slugOrder.indexOf(a.slug);
							const bOrder = slugOrder.indexOf(b.slug);

							if (aOrder === -1 && bOrder === -1) return 0;
							if (aOrder === -1) return 1;
							if (bOrder === -1) return -1;
							return aOrder - bOrder;
						})
						.map((cat) => {
							return { id: cat.slug, text: cat.name };
						});

					setMenu(items);
					setAttributes({ menuItems: items });
				}
			}, [categories]);

			const updateMenuItem = (text, index) => {
				let newItems = [...menuItems];
				newItems[index] = { ...newItems[index], text: text };
				setAttributes({ menuItems: newItems });
			};

			const colors = [
				{
					label: __("Background Color", "cgb"),
					value: backgroundColor.color,
					onChange: setBackgroundColor,
				},
				{
					label: __("Text Color", "cgb"),
					value: textColor.color,
					onChange: setTextColor,
				},
			];

			return (
				<div
					className={`${className} ${backgroundColor.class} ${textColor.class}`}
					style={{
						backgroundColor: backgroundColor.color,
						color: textColor.color,
					}}
				>
					<BlockControls></BlockControls>

					<InspectorControls>
						<PanelColorSettings
							title={__("Color Settings", "cgb")}
							colorSettings={colors}
						/>
					</InspectorControls>

					<nav className="section-nav">
						{menuItems.map((item, index) => (
							<a key={index} className="section_nav-item" href={`#${item.id}`}>
								<RichText
									tagName="span"
									value={item.text}
									onChange={(text) => updateMenuItem(text, index)}
								/>
							</a>
						))}
					</nav>
					<p className="nav_download">
						Downloaden Sie <span className="nav_download-here">hier</span> gerne
						unseren Gesamtkatalog.{" "}
					</p>
				</div>
			);
		}
	),

	save: ({ attributes: { menuItems, className } }) => {
		return (
			<div className={className}>
				<nav className="section-nav">
					{menuItems.map((item, index) => (
						<a key={index} className="section_nav-item" href={`#${item.id}`}>
							<RichText.Content tagName="span" value={item.text} />
						</a>
					))}
				</nav>
				<p className="nav_download">
					Downloaden Sie <span className="nav_download-here">hier</span> gerne
					unseren Gesamtkatalog.{" "}
				</p>
			</div>
		);
	},
});
